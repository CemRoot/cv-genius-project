import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Lightbulb, Target, Plus, X, ChevronDown, ChevronUp, Type } from 'lucide-react';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ThemeSelector, { CoverLetterTheme } from '@/components/ui/ThemeSelector';

interface Step4Props {
  initialData?: {
    skills: string;
    job_description?: string;
    theme?: string;
  };
  onNext: (data: { skills: string; job_description?: string; theme?: string }) => void;
  onPrevious: () => void;
}

const Step4_Skills: React.FC<Step4Props> = ({
  initialData,
  onNext,
  onPrevious
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm<{ skills: string; job_description: string }>({
    defaultValues: {
      skills: initialData?.skills || '',
      job_description: initialData?.job_description || ''
    },
    mode: 'onChange'
  });

  const onSubmit = (data: { skills: string; job_description: string }) => {
    onNext({
      skills: data.skills,
      job_description: data.job_description.trim() || undefined,
      theme: selectedTheme
    });
  };

  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialData?.skills ? initialData.skills.split(', ') : []);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Programming Languages']);
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>(initialData?.theme || 'classic');

  const skillCategories = {
    "Programming Languages": [
      "Python", "JavaScript", "TypeScript", "Java", "C#", "C++", "Go", "Rust", "Swift", "Kotlin",
      "PHP", "Ruby", "Scala", "R", "MATLAB", "SQL", "HTML/CSS", "Dart", "Perl", "Shell/Bash"
    ],
    "Frontend Technologies": [
      "React", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Svelte", "jQuery", "Bootstrap", "Tailwind CSS",
      "Material-UI", "Styled Components", "Sass/SCSS", "Less", "Webpack", "Vite", "Parcel"
    ],
    "Backend Technologies": [
      "Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET", "Laravel",
      "Ruby on Rails", "Symfony", "NestJS", "Koa.js", "Gin", "Echo", "Actix"
    ],
    "Databases": [
      "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server", "Cassandra",
      "DynamoDB", "Neo4j", "InfluxDB", "Elasticsearch", "Firebase", "Supabase"
    ],
    "Cloud & DevOps": [
      "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "GitLab CI/CD", "GitHub Actions",
      "Terraform", "Ansible", "Chef", "Puppet", "Helm", "Istio", "Prometheus", "Grafana"
    ],
    "Mobile Development": [
      "React Native", "Flutter", "iOS Development", "Android Development", "Xamarin", "Ionic",
      "Cordova", "Unity", "Unreal Engine", "SwiftUI", "Jetpack Compose"
    ],
    "Data Science & AI": [
      "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas",
      "NumPy", "Jupyter", "Apache Spark", "Hadoop", "Airflow", "MLflow", "Kubeflow"
    ],
    "Design & UX": [
      "UI/UX Design", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InVision",
      "Prototyping", "Wireframing", "User Research", "Usability Testing", "Design Systems"
    ],
    "Project Management": [
      "Agile", "Scrum", "Kanban", "JIRA", "Trello", "Asana", "Monday.com", "Confluence",
      "Risk Management", "Stakeholder Management", "Budget Management", "Team Leadership"
    ],
    "Soft Skills": [
      "Communication", "Leadership", "Problem Solving", "Critical Thinking", "Teamwork",
      "Adaptability", "Time Management", "Creativity", "Analytical Thinking", "Decision Making",
      "Conflict Resolution", "Mentoring", "Public Speaking", "Negotiation", "Emotional Intelligence"
    ],
    "Languages": [
      "English (Native)", "English (Fluent)", "English (Conversational)", "Irish (Native)", "Irish (Fluent)",
      "Irish (Conversational)", "Spanish (Fluent)", "Spanish (Conversational)", "French (Fluent)",
      "French (Conversational)", "German (Fluent)", "German (Conversational)", "Mandarin (Fluent)",
      "Mandarin (Conversational)", "Portuguese (Fluent)", "Italian (Conversational)"
    ],
    "Certifications": [
      "AWS Certified Solutions Architect", "AWS Certified Developer", "Google Cloud Professional",
      "Microsoft Azure Fundamentals", "Scrum Master (CSM)", "PMP", "CISSP", "CompTIA Security+",
      "Certified Kubernetes Administrator", "Docker Certified Associate", "Salesforce Administrator",
      "Google Analytics Certified", "HubSpot Certified", "Tableau Desktop Specialist"
    ]
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      // Update form value
      const skillsString = newSkills.join(', ');
      setValue('skills', skillsString);
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = selectedSkills.filter(s => s !== skill);
    setSelectedSkills(newSkills);
    // Update form value
    const skillsString = newSkills.join(', ');
    setValue('skills', skillsString);
  };

  const addCustomSkill = () => {
    const skill = customSkillInput.trim();
    if (skill && !selectedSkills.includes(skill)) {
      addSkill(skill);
      setCustomSkillInput('');
    }
  };

  const handleCustomSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomSkill();
    }
  };

  const jobTemplates = [
    {
      title: "Software Engineer",
      category: "Technology",
      description: "We are seeking a skilled Software Engineer to join our development team. The ideal candidate will have experience in full-stack development, working with modern frameworks like React, Node.js, and cloud technologies. Responsibilities include designing and implementing software solutions, collaborating with cross-functional teams, and maintaining high-quality code standards. Requirements: Bachelor's degree in Computer Science, 3+ years of software development experience, proficiency in JavaScript, Python, or Java, experience with databases and version control systems."
    },
    {
      title: "Data Scientist",
      category: "Technology",
      description: "Join our data science team to drive insights and innovation through advanced analytics. You'll work on machine learning models, statistical analysis, and data visualization to support business decisions. Key responsibilities include developing predictive models, analyzing large datasets, and presenting findings to stakeholders. Requirements: Master's degree in Data Science, Statistics, or related field, proficiency in Python/R, experience with SQL, machine learning libraries (scikit-learn, TensorFlow), and data visualization tools."
    },
    {
      title: "Product Manager",
      category: "Management",
      description: "We're looking for a Product Manager to lead product strategy and execution. You'll work closely with engineering, design, and business teams to deliver exceptional user experiences. Responsibilities include defining product roadmaps, conducting market research, managing stakeholder relationships, and driving product launches. Requirements: 5+ years of product management experience, strong analytical skills, experience with agile methodologies, excellent communication skills, and a track record of successful product launches."
    },
    {
      title: "Digital Marketing Manager",
      category: "Marketing",
      description: "Lead our digital marketing efforts across multiple channels including social media, email, and content marketing. You'll develop and execute marketing campaigns, analyze performance metrics, and optimize conversion rates. Key responsibilities include managing digital advertising campaigns, creating content strategies, and collaborating with creative teams. Requirements: Bachelor's degree in Marketing, 4+ years of digital marketing experience, proficiency in Google Analytics, social media platforms, and marketing automation tools."
    },
    {
      title: "UX/UI Designer",
      category: "Design",
      description: "Join our design team to create intuitive and engaging user experiences. You'll conduct user research, create wireframes and prototypes, and collaborate with developers to bring designs to life. Responsibilities include user testing, design system maintenance, and ensuring accessibility standards. Requirements: Portfolio demonstrating UX/UI design skills, proficiency in Figma, Sketch, or Adobe XD, understanding of HTML/CSS, experience with user research methodologies, and strong communication skills."
    },
    {
      title: "DevOps Engineer",
      category: "Technology",
      description: "We're seeking a DevOps Engineer to streamline our development and deployment processes. You'll work on CI/CD pipelines, infrastructure automation, and cloud architecture. Key responsibilities include managing containerized applications, monitoring system performance, and ensuring security best practices. Requirements: Experience with AWS/Azure/GCP, proficiency in Docker and Kubernetes, knowledge of Infrastructure as Code (Terraform), scripting skills in Python/Bash, and experience with monitoring tools."
    },
    {
      title: "Sales Representative",
      category: "Sales",
      description: "Join our sales team to drive revenue growth and build lasting client relationships. You'll identify new business opportunities, conduct product demonstrations, and negotiate contracts. Responsibilities include prospecting leads, managing sales pipeline, and achieving quarterly targets. Requirements: Proven sales track record, excellent communication and negotiation skills, experience with CRM systems, ability to travel as needed, and a results-driven mindset."
    },
    {
      title: "Financial Analyst",
      category: "Finance",
      description: "Support our finance team with financial modeling, budgeting, and analysis. You'll prepare financial reports, conduct variance analysis, and assist with strategic planning initiatives. Key responsibilities include creating financial dashboards, supporting month-end close processes, and providing insights to management. Requirements: Bachelor's degree in Finance or Accounting, proficiency in Excel and financial modeling, experience with ERP systems, strong analytical skills, and attention to detail."
    },
    {
      title: "Human Resources Manager",
      category: "HR",
      description: "Lead our HR initiatives including talent acquisition, employee development, and workplace culture. You'll manage the full employee lifecycle from recruitment to retention. Responsibilities include developing HR policies, conducting performance reviews, and ensuring compliance with employment laws. Requirements: HR degree or certification, 5+ years of HR experience, knowledge of employment law, experience with HRIS systems, and strong interpersonal skills."
    },
    {
      title: "Content Writer",
      category: "Marketing",
      description: "Create compelling content across various channels including blog posts, social media, and marketing materials. You'll research industry trends, optimize content for SEO, and maintain brand voice consistency. Key responsibilities include content planning, editing, and collaborating with marketing teams. Requirements: Excellent writing and editing skills, experience with content management systems, knowledge of SEO best practices, ability to write for different audiences, and strong research skills."
    },
    {
      title: "Business Analyst",
      category: "Business",
      description: "Analyze business processes and requirements to drive operational improvements. You'll work with stakeholders to identify opportunities, document requirements, and support system implementations. Responsibilities include process mapping, data analysis, and project coordination. Requirements: Bachelor's degree in Business or related field, experience with process improvement methodologies, proficiency in data analysis tools, strong problem-solving skills, and excellent documentation abilities."
    },
    {
      title: "Cybersecurity Specialist",
      category: "Technology",
      description: "Protect our organization's digital assets through comprehensive security measures. You'll monitor security threats, implement protective measures, and respond to incidents. Key responsibilities include vulnerability assessments, security audits, and employee training. Requirements: Cybersecurity certification (CISSP, CEH), experience with security tools and frameworks, knowledge of compliance requirements, incident response experience, and strong analytical skills."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Skills & Job Targeting
        </h2>
        <p className="text-gray-600">
          List your key skills and optionally provide a job description to tailor your CV 
          for a specific role. Our AI will organize and optimize your skills presentation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Skills Section */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Your Skills</h3>
          </div>

          {/* Manual Skill Addition Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center mb-3">
              <Type className="w-4 h-4 text-gray-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Add Custom Skills</h4>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyPress={handleCustomSkillKeyPress}
                  placeholder="Type a skill name (e.g., React, Project Management, Public Speaking...)"
                  className="w-full"
                />
              </div>
              <Button
                type="button"
                onClick={addCustomSkill}
                disabled={!customSkillInput.trim() || selectedSkills.includes(customSkillInput.trim())}
                variant="outline"
                className="whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Skill
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Can't find a skill in our categories? Add it manually here!
            </p>
          </div>

          {/* Selected Skills Display */}
          {selectedSkills.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Skills ({selectedSkills.length}):</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skill Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Choose from skill categories:</h4>
            {Object.entries(skillCategories).map(([category, skills]) => (
              <div key={category} className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <span className="font-medium text-gray-900">{category}</span>
                  {expandedCategories.includes(category) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedCategories.includes(category) && (
                  <div className="px-4 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => addSkill(skill)}
                          disabled={selectedSkills.includes(skill)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedSkills.includes(skill)
                              ? 'bg-green-100 text-green-800 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800'
                          }`}
                        >
                          {selectedSkills.includes(skill) ? (
                            <>
                              <span className="mr-1">✓</span>
                              {skill}
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 mr-1" />
                              {skill}
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Custom Skills Input - Editable textarea */}
          <Controller
            name="skills"
            control={control}
            rules={{
              required: 'Skills are required',
              minLength: {
                value: 10,
                message: 'Skills must be at least 10 characters'
              },
              validate: (value) => {
                const trimmedValue = value?.trim() || '';
                if (trimmedValue.length < 10) {
                  return 'Skills must be at least 10 characters';
                }
                return selectedSkills.length > 0 || trimmedValue.length >= 10 || 'Please add at least one skill';
              }
            }}
            render={({ field }) => (
              <div className="mt-6">
                <Textarea
                  {...field}
                  value={selectedSkills.join(', ')}
                  onChange={(e) => {
                    const skills = e.target.value.split(', ').filter(s => s.trim());
                    setSelectedSkills(skills);
                    field.onChange(e.target.value);
                  }}
                  label="All Selected Skills (Editable)"
                  placeholder="Your selected skills will appear here, or type custom skills separated by commas..."
                  error={errors.skills?.message}
                  rows={4}
                  helpText="You can edit this list directly, use the categories above, or add custom skills using the input field"
                />
              </div>
            )}
          />

        </div>

        {/* Theme Selection Section */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Type className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Cover Letter Style</h3>
          </div>
          
          <ThemeSelector
            selectedTheme={selectedTheme as CoverLetterTheme}
            onThemeChange={setSelectedTheme}
          />
        </div>

        {/* Job Description Section */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 text-secondary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Target Job (Optional)</h3>
          </div>

          {/* Job Templates */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Job Templates:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {jobTemplates.map((template, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setValue('job_description', template.description);
                  }}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">{template.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{template.category}</div>
                </button>
              ))}
            </div>
          </div>

          <Controller
            name="job_description"
            control={control}
            rules={{
              validate: (value) => {
                if (value && value.trim().length > 0 && value.trim().length < 50) {
                  return 'Job description must be at least 50 characters if provided';
                }
                return true;
              }
            }}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Job Description"
                placeholder="Paste the job description here if you want to tailor your CV for a specific role..."
                error={errors.job_description?.message}
                rows={8}
                helpText="Optional: Providing a job description helps our AI optimize your CV with relevant keywords and focus areas"
              />
            )}
          />

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex">
              <Target className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Pro Tip:</p>
                <p className="text-blue-800">
                  Including a job description allows our AI to:
                </p>
                <ul className="list-disc list-inside mt-2 text-blue-700 space-y-1">
                  <li>Highlight relevant skills and experience</li>
                  <li>Use keywords that match the role</li>
                  <li>Create a targeted professional summary</li>
                  <li>Generate a personalized cover letter</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onPrevious}
          >
            Previous
          </Button>
          
          <Button
            type="submit"
            disabled={!isValid}
            size="lg"
            className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
          >
            Generate My CV
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Step4_Skills;