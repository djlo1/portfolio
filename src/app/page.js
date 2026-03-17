import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppChat from "@/components/WhatsAppChat";
import {
  personalInfo as localPersonal,
  experiences as localExperiences,
  skills as localSkills,
  projects as localProjects,
  education as localEducation,
  languages as localLanguages,
} from "@/data/portfolio";
import { createClient } from "@supabase/supabase-js";

// Fetch data server-side from Supabase, with local fallback
async function getPortfolioData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return {
      personal: localPersonal,
      experiences: localExperiences,
      skills: localSkills,
      projects: localProjects,
      education: localEducation,
      languages: localLanguages,
    };
  }

  const sb = createClient(url, key);

  async function fetch(table, fallback, orderCol = "sort_order") {
    try {
      const { data, error } = await sb
        .from(table)
        .select("*")
        .order(orderCol, { ascending: true });
      if (error) throw error;
      return data && data.length > 0 ? data : fallback;
    } catch {
      return fallback;
    }
  }

  const [personalArr, experiences, skills, projects, education, languages] = await Promise.all([
    fetch("personal_info", [localPersonal], "updated_at"),
    fetch("experiences", localExperiences),
    fetch("skills", localSkills),
    fetch("projects", localProjects),
    fetch("education", localEducation),
    fetch("languages", localLanguages),
  ]);

  // personal_info is a single row — extract from array
  const personal = Array.isArray(personalArr) && personalArr.length > 0
    ? {
        firstName: personalArr[0].first_name,
        lastName: personalArr[0].last_name,
        title: personalArr[0].title,
        tagline: personalArr[0].tagline,
        description: personalArr[0].description,
        email: personalArr[0].email,
        phone: personalArr[0].phone,
        location: personalArr[0].location,
        linkedin: personalArr[0].linkedin,
        youtube: personalArr[0].youtube,
        photo: personalArr[0].photo_url || "/photo.jpg",
      }
    : localPersonal;

  return { personal, experiences, skills, projects, education, languages };
}

export const revalidate = 60; // ISR: refresh every 60 seconds

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <main className="relative">
      <Navbar />
      <Hero data={data.personal} />
      <About data={data.personal} />
      <Experience data={data.experiences} />
      <Skills data={data.skills} languages={data.languages} />
      <Projects data={data.projects} />
      <Education data={data.education} />
      <Contact data={data.personal} />
      <Footer data={data.personal} />
  <WhatsAppChat phone="22901999989929" name="Djlo" />
    </main>
  );
}
