import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Binh Phuong Nguyen and this blog',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
            <h1 className="text-4xl font-bold mb-4">About Me</h1>
            <p className="text-xl opacity-90">
              Software developer, technology enthusiast, and lifelong learner
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-12">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Hello, I&apos;m Binh Phuong Nguyen!</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Welcome to my personal blog! I&apos;m a passionate software developer with a love for 
                  creating efficient, scalable, and user-friendly applications. This blog is where I 
                  share my journey through the ever-evolving world of technology, programming insights, 
                  and lessons learned from real-world projects.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What I Do</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <svg
                        className="w-6 h-6 text-blue-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      <h4 className="font-semibold text-gray-900">Full-Stack Development</h4>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Building complete web applications using modern frameworks like React, Next.js, 
                      Node.js, and various databases.
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <svg
                        className="w-6 h-6 text-green-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      <h4 className="font-semibold text-gray-900">Problem Solving</h4>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Analyzing complex problems and creating elegant solutions through clean, 
                      maintainable code and thoughtful architecture.
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <svg
                        className="w-6 h-6 text-purple-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <h4 className="font-semibold text-gray-900">Continuous Learning</h4>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Staying up-to-date with the latest technologies, best practices, and 
                      industry trends through constant learning and experimentation.
                    </p>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <svg
                        className="w-6 h-6 text-yellow-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                      <h4 className="font-semibold text-gray-900">Knowledge Sharing</h4>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Writing tutorials, documentation, and blog posts to help other developers 
                      learn and grow in their careers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Skills</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    'JavaScript/TypeScript',
                    'React & Next.js',
                    'Node.js',
                    'Python',
                    'MongoDB',
                    'PostgreSQL',
                    'AWS/Cloud',
                    'Docker',
                    'Git & GitHub',
                    'REST APIs',
                    'GraphQL',
                    'TailwindCSS'
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 text-center"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Why This Blog?</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  I believe in the power of sharing knowledge and experiences. This blog serves 
                  multiple purposes:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Document my learning journey and projects</li>
                  <li>Share practical tutorials and code examples</li>
                  <li>Discuss industry trends and emerging technologies</li>
                  <li>Connect with fellow developers and tech enthusiasts</li>
                  <li>Create a resource for developers at all skill levels</li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Beyond Code</h3>
                <p className="text-gray-600 leading-relaxed">
                  When I&apos;m not coding, you can find me exploring new technologies, reading tech books, 
                  contributing to open-source projects, or enjoying outdoor activities. I believe that 
                  a well-rounded perspective helps create better software and more innovative solutions.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Let&apos;s Connect!</h3>
                <p className="text-gray-600 mb-4">
                  I&apos;m always excited to connect with fellow developers, discuss interesting projects, 
                  or collaborate on meaningful work. Feel free to reach out!
                </p>
                <div className="flex space-x-4">
                  <a
                    href="mailto:contact@example.com"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Email Me
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
