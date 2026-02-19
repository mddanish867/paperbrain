import { 
  MessageSquare, 
  FileText, 
  Code, 
  Database, 
  Globe,  
  CheckCircle,
  GitBranch,
 
} from 'lucide-react';


const AboutPage = () => {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Chat with PDFs",
      description: "Upload any PDF document and have intelligent conversations with our AI to extract insights, summarize content, and answer specific questions."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Smart Document Generation",
      description: "Generate comprehensive technical documentation, API specs, and project documentation automatically from your codebase and discussions."
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Code Review Assistant",
      description: "Connect GitHub, GitLab, Azure DevOps, and Bitbucket repositories for AI-powered code reviews, bug detection, and best practice suggestions."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Latest Tech Documentation",
      description: "Access real-time web search capabilities to fetch and understand the latest technology documentation for seamless integration into your projects."
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "SQL Database Chat",
      description: "Chat directly with your SQL databases to query data, generate reports, and get insights without writing complex SQL queries."
    },
    {
      icon: <GitBranch className="h-8 w-8" />,
      title: "Multi-Platform Integration",
      description: "Seamlessly connect with all major version control platforms and CI/CD pipelines for a unified development experience."
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Developers" },
    { value: "500K+", label: "PDFs Processed" },
    { value: "50K+", label: "Repositories Connected" },
    { value: "99.9%", label: "Uptime" }
  ];

  const capabilities = [
    "Real-time code analysis and suggestions",
    "Automated documentation generation",
    "Multi-format file support (PDF, DOCX, MD)",
    "Secure repository connections",
    "Team collaboration features",
    "Custom AI model training",
    "API access for integration",
    "Enterprise-grade security"
  ];

  return (
      <div className="min-h-screen bg-white border border-b-0">     
     

      {/* Stats Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent md:text-4xl">{stat.value}</div>
                <div className="text-sm text-gray-600 md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-5xl">
              Everything You Need in One Platform
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Comprehensive AI tools designed specifically for developer productivity and collaboration.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg">
                <div className="mb-6 inline-flex items-center justify-center rounded-xl bg-blue-100 p-3 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 md:py-24 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Enterprise-Grade Capabilities
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Built with security, scalability, and performance in mind for teams of all sizes.
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-blue-600" />
                  <span className="text-gray-700">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default AboutPage;