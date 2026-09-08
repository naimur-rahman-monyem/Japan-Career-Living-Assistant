import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  await prisma.$transaction([
    prisma.jobApplication.deleteMany(),
    prisma.savedJob.deleteMany(),
    prisma.job.deleteMany(),
    prisma.userSkill.deleteMany(),
    prisma.costOfLiving.deleteMany(),
    prisma.company.deleteMany(),
    prisma.location.deleteMany(),
    prisma.jobCategory.deleteMany(),
    prisma.skill.deleteMany(),
    prisma.salaryData.deleteMany(),
    prisma.visaInformation.deleteMany(),
    prisma.resource.deleteMany(),
  ]);
  const levels = await Promise.all(["N5","N4","N3","N2","N1"].map((code)=>prisma.japaneseLevel.upsert({where:{code},update:{label:`JLPT ${code}`,description:`Practical benchmark for ${code} learners.`},create:{code,label:`JLPT ${code}`,description:`Practical benchmark for ${code} learners.`}})));
  const [tech,design,education] = await Promise.all(["Technology","Design","Education"].map((name)=>prisma.jobCategory.create({data:{name,slug:name.toLowerCase()}})));
  const [tokyo,osaka,kyoto] = await Promise.all([["Tokyo","Tokyo","Japan’s global hub for technology and international teams."],["Osaka","Osaka","An energetic, welcoming city with a lower cost of living."],["Kyoto","Kyoto","A creative city blending tradition, tourism and innovation."]].map(([name,prefecture,description])=>prisma.location.create({data:{name,slug:name.toLowerCase(),prefecture,description}})));
  const extraLocations = await Promise.all([["Nagoya","Aichi","A manufacturing and engineering center with a balanced cost of living."],["Fukuoka","Fukuoka","A relaxed, internationally connected technology hub in Kyushu."],["Sapporo","Hokkaido","A spacious northern city with an emerging startup scene."],["Yokohama","Kanagawa","A waterfront business city within easy reach of Tokyo."],["Kobe","Hyogo","A compact port city with international employers and culture."],["Sendai","Miyagi","A regional technology center with a comfortable pace of life."]].map(([name,prefecture,description])=>prisma.location.create({data:{name,slug:name.toLowerCase(),prefecture,description}})));
  await Promise.all([[tokyo.id,120000],[osaka.id,85000],[kyoto.id,80000]].map(([locationId,monthlyRent])=>prisma.costOfLiving.create({data:{locationId:locationId as string,monthlyRent:monthlyRent as number,monthlyEssentials:70000,transport:12000}})));
  const [js,python,ux] = await Promise.all([["JavaScript","Engineering"],["Python","Engineering"],["UX Research","Design"]].map(([name,category])=>prisma.skill.create({data:{name,category}})));
  const extraSkills = await Promise.all([["TypeScript","Engineering"],["React","Engineering"],["Next.js","Engineering"],["Java","Engineering"],["C#","Engineering"],[".NET","Engineering"],["SQL","Data"],["AWS","Cloud"],["Docker","Cloud"],["Kubernetes","Cloud"],["Terraform","Cloud"],["Machine Learning","Data"],["Data Analysis","Data"],["Testing","Quality"],["Linux","Operations"],["Customer Support","Support"]].map(([name,category])=>prisma.skill.create({data:{name,category}})));
  const companies = await Promise.all([["Sora Labs","sora-labs","Product technology for a more connected Japan.","Software"],["Mori Design","mori-design","Human-centred design studio with global clients.","Design"],["Hikari Learning","hikari-learning","Language and career education for new residents.","Education"]].map(([name,slug,description,industry])=>prisma.company.create({data:{name,slug,description,industry,website:"https://example.com"}})));
  const jobs = await Promise.all([
    prisma.job.create({data:{title:"Frontend Engineer",slug:"frontend-engineer-sora",description:"Join a bilingual product team building tools used by millions across Asia.",employmentType:"FULL_TIME",minSalary:5500000,maxSalary:8000000,visaSupport:true,remote:true,companyId:companies[0].id,locationId:tokyo.id,categoryId:tech.id,skills:{connect:[{id:js.id}]}}}),
    prisma.job.create({data:{title:"Product Designer",slug:"product-designer-mori",description:"Shape clear, delightful experiences for international customers.",employmentType:"FULL_TIME",minSalary:4500000,maxSalary:6800000,visaSupport:true,remote:false,companyId:companies[1].id,locationId:osaka.id,categoryId:design.id,skills:{connect:[{id:ux.id}]}}}),
    prisma.job.create({data:{title:"English Instructor",slug:"english-instructor-hikari",description:"Support learners with practical language and career confidence.",employmentType:"FULL_TIME",minSalary:3200000,maxSalary:4400000,visaSupport:true,remote:false,companyId:companies[2].id,locationId:kyoto.id,categoryId:education.id}})
  ]);
  const allLocations = [tokyo, osaka, kyoto, ...extraLocations];
  const extraCompanies = await Promise.all(["Kaze Systems","Mizu Cloud","Hoshi Analytics","Nami Digital","Aoba Works","Sakura Platform","Kumo Networks","Asahi Robotics","Tsubasa Labs","Yuki Commerce"].map((name, index) => prisma.company.create({data:{name,slug:name.toLowerCase().replace(/[^a-z0-9]+/g,"-"),description:"Fictional demo employer for Japan Career & Living Assistant planning.",industry:index % 3 === 0 ? "Software" : index % 3 === 1 ? "Cloud" : "Data",website:null}})));
  const extraJobs = [
    ["Full Stack Developer","full-stack-developer-kaze","Kaze Systems",0,"Technology",6200000,9000000,true,["TypeScript","React","Node.js","SQL"]],
    ["Backend Developer","backend-developer-mizu","Mizu Cloud",1,"Technology",5800000,8500000,true,["Java","SQL","AWS"]],
    ["React Developer","react-developer-nami","Nami Digital",2,"Technology",5000000,7600000,true,["React","TypeScript","JavaScript"]],
    ["Next.js Developer","nextjs-developer-aoba","Aoba Works",3,"Technology",5500000,8200000,true,["Next.js","React","TypeScript"]],
    ["Java Developer","java-developer-sakura","Sakura Platform",4,"Technology",5200000,7800000,true,["Java","SQL","Docker"]],
    ["C# Developer","csharp-developer-kumo","Kumo Networks",5,"Technology",5400000,8000000,false,["C#",".NET","SQL"]],
    [".NET Developer","dotnet-developer-asahi","Asahi Robotics",6,"Technology",5600000,8300000,true,[".NET","C#","Azure"]],
    ["Python Developer","python-developer-hoshi","Hoshi Analytics",7,"Technology",6000000,9200000,true,["Python","SQL","Docker"]],
    ["Data Analyst","data-analyst-hoshi","Hoshi Analytics",8,"Technology",4500000,6800000,true,["Python","Data Analysis","SQL"]],
    ["Data Scientist","data-scientist-yuki","Yuki Commerce",0,"Technology",6500000,10000000,true,["Python","Machine Learning","SQL"]],
    ["Machine Learning Engineer","ml-engineer-yuki","Yuki Commerce",1,"Technology",7000000,11000000,true,["Python","Machine Learning","Docker"]],
    ["DevOps Engineer","devops-engineer-mizu","Mizu Cloud",2,"Technology",6200000,9500000,true,["AWS","Docker","Kubernetes"]],
    ["Cloud Engineer","cloud-engineer-mizu","Mizu Cloud",3,"Technology",6000000,9200000,true,["AWS","Terraform","Linux"]],
    ["QA Engineer","qa-engineer-sakura","Sakura Platform",4,"Technology",4200000,6500000,true,["Testing","Java","SQL"]],
    ["System Engineer","system-engineer-kaze","Kaze Systems",5,"Technology",5000000,7600000,true,["Linux","SQL","Java"]],
    ["IT Support Engineer","it-support-kumo","Kumo Networks",6,"Technology",3600000,5200000,true,["Customer Support","Linux","SQL"]],
    ["Web Developer","web-developer-nami","Nami Digital",7,"Technology",4000000,6200000,false,["JavaScript","React","SQL"]],
    ["AI Engineer","ai-engineer-asahi","Asahi Robotics",8,"Technology",6800000,10500000,true,["Python","Machine Learning","Linux"]],
    ["Frontend Developer","frontend-developer-aoba","Aoba Works",0,"Technology",4800000,7200000,true,["React","TypeScript","JavaScript"]],
    ["Platform Engineer","platform-engineer-sakura","Sakura Platform",1,"Technology",6500000,9800000,true,["Kubernetes","Terraform","AWS"]],
    ["Technical Product Designer","technical-designer-aoba","Aoba Works",2,"Design",4500000,7000000,true,["UX Research","React","Data Analysis"]],
    ["Product Designer","product-designer-nami","Nami Digital",3,"Design",4300000,6800000,true,["UX Research","JavaScript"]],
    ["Solutions Architect","solutions-architect-mizu","Mizu Cloud",4,"Technology",7500000,12000000,true,["AWS","Terraform","Docker"]],
    ["Security Engineer","security-engineer-kumo","Kumo Networks",5,"Technology",6000000,9500000,true,["Linux","Python","AWS"]],
    ["Release Engineer","release-engineer-kaze","Kaze Systems",6,"Technology",5200000,8000000,true,["Docker","Kubernetes","Testing"]],
    ["Database Engineer","database-engineer-hoshi","Hoshi Analytics",7,"Technology",5500000,8500000,true,["SQL","Python","Linux"]],
    ["Site Reliability Engineer","sre-yuki","Yuki Commerce",8,"Technology",6500000,10000000,true,["Kubernetes","AWS","Linux"]],
    ["Mobile Application Engineer","mobile-engineer-aoba","Aoba Works",0,"Technology",5000000,7800000,true,["JavaScript","React","TypeScript"]],
    ["ERP Implementation Engineer","erp-engineer-asahi","Asahi Robotics",1,"Technology",4800000,7400000,true,["C#","SQL","Customer Support"]],
    ["Technical Support Specialist","technical-support-kaze","Kaze Systems",2,"Technology",3500000,5000000,true,["Customer Support","Linux","SQL"]],
  ] as const;
  await Promise.all(extraJobs.map(([title, slug, companyName, locationIndex, categoryName, minSalary, maxSalary, visaSupport, skillNames]) => {
    const company = [...companies, ...extraCompanies].find((entry) => entry.name === companyName)!;
    const category = [tech, design, education].find((entry) => entry.name === categoryName)!;
    const skills = [...[js, python, ux], ...extraSkills].filter((skill) => (skillNames as readonly string[]).includes(skill.name));
    return prisma.job.create({data:{title,slug,description:`${title} role at a fictional Japanese employer. This seeded demo listing is provided for career planning practice.`,employmentType:"FULL_TIME",minSalary,maxSalary,visaSupport,remote:false,companyId:company.id,locationId:allLocations[locationIndex].id,categoryId:category.id,skills:{connect:skills.map((skill) => ({id:skill.id}))}}});
  }));
  await Promise.all([["Engineer","Tokyo","MID",5000000,7000000,9000000],["Designer","Osaka","MID",4000000,5600000,7500000],["Instructor","Kyoto","ENTRY",2800000,3400000,4300000]].map(([role,location,experienceLevel,minSalary,medianSalary,maxSalary])=>prisma.salaryData.create({data:{role:role as string,location:location as string,experienceLevel:experienceLevel as string,minSalary:minSalary as number,medianSalary:medianSalary as number,maxSalary:maxSalary as number}})));
  await Promise.all([["Engineer visa","engineer-humanities","For professional work in engineering, technology, education and humanities.","A relevant degree or 10 years’ experience plus a qualifying offer.","1–5 years","https://www.moj.go.jp/isa/"],["Highly skilled professional","highly-skilled","Points-based route for advanced professionals.","Points across education, income, experience and Japanese ability.","5 years","https://www.moj.go.jp/isa/"]].map(([name,slug,summary,requirements,typicalDuration,officialUrl])=>prisma.visaInformation.create({data:{name,slug,summary,requirements,typicalDuration,officialUrl}})));
  const passwordHash=await bcrypt.hash("demo1234",12);
  await prisma.user.upsert({where:{email:"demo@example.com"},update:{},create:{email:"demo@example.com",name:"Demo Explorer",passwordHash,profile:{create:{targetCity:"Tokyo",japaneseLevelId:levels[2].id}}}});
  const adminEmail=process.env.ADMIN_EMAIL??"admin@jcla.local";
  const adminPassword=process.env.ADMIN_PASSWORD??"JapanAdmin!2026";
  await prisma.user.upsert({where:{email:adminEmail},update:{name:"System Administrator",role:"ADMIN"},create:{email:adminEmail,name:"System Administrator",role:"ADMIN",passwordHash:await bcrypt.hash(adminPassword,12),profile:{create:{}}}});
  await prisma.resource.createMany({data:[{title:"Japan visa pathways explained",category:"Visa",summary:"Plain-language overview of work, student and dependent routes.",url:"https://www.moj.go.jp/isa/",featured:true},{title:"Japanese resume checklist",category:"Career",summary:"Format and chronology tips for a strong first application.",url:"#",featured:true}]});
  console.log(`Seeded ${jobs.length + extraJobs.length} jobs, ${companies.length + extraCompanies.length} companies, ${allLocations.length} locations and domain reference data.`);
}
main().finally(()=>prisma.$disconnect());
