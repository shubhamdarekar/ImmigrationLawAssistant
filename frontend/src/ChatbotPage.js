import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, FileText, Link, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your Immigration Law Assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

   // Resources
   const resources = [
    { type: 'pdf', title: 'Fee Schedule', link: 'https://www.uscis.gov/sites/default/files/document/forms/g-1055.pdf' },
    { type: 'pdf', title: 'Instructions for Form N-400', link: 'https://www.uscis.gov/sites/default/files/document/forms/n-400instr.pdf' },
    { type: 'pdf', title: 'Instructions for Form I-90', link: 'https://www.uscis.gov/sites/default/files/document/forms/i-90instr.pdf' },
    { type: 'pdf', title: 'Instructions for Form I-130', link: 'https://www.uscis.gov/sites/default/files/document/forms/i-130instr.pdf' },
    { type: 'pdf', title: 'Instructions for Form I-589', link: 'https://www.uscis.gov/sites/default/files/document/forms/i-589instr.pdf' },
    { type: 'link', title: 'USCIS Official Website', link: 'https://www.uscis.gov/' },
    { type: 'link', title: 'USCIS Visa Information', link: 'https://travel.state.gov/content/travel/en/us-visas/immigrate.html' },
    { type: 'link', title: 'USCIS Green Card Information', link: 'https://www.uscis.gov/green-card' },
    { type: 'link', title: 'USCIS Forms and Instructions', link: 'https://www.uscis.gov/forms/all-forms' },
    { type: 'link', title: 'USCIS Processing Times', link: 'https://egov.uscis.gov/processing-times/' },
    { type: 'link', title: 'USCIS Frequently Asked Questions', link: 'https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/frequently-asked-questions.html' }
  ];

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Python script
      // Mock backend API call
      setTimeout(() => {
        // Assuming this is the response from your RAG model
        const responseFromRAG = "Based on current immigration regulations, F-1 student visa holders can work on-campus for up to 20 hours per week during the school year and full-time during breaks. For off-campus employment, you'll need either Curricular Practical Training (CPT) authorization for work related to your field of study, or Optional Practical Training (OPT) which allows for up to 12 months of work experience after completion of your degree. STEM degree holders may qualify for a 24-month OPT extension.";
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: responseFromRAG
        }]);
        setIsLoading(false);
      }, 2000);
      
      /* Actual implementation
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer
      }]);
      setIsLoading(false);
    */
    } catch (error) {
      console.error('查询模型时出错:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "抱歉，处理您的请求时出现错误。请稍后再试。"
      }]);
      setIsLoading(false);
    }
  };

  // Navigate to lawyer connection page
  const navigateToLawyerConnection = () => {
    navigate('/lawyer-connection');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Title bar - modified to single line and 2:1 ratio */}
      <div className="flex bg-blue-500 text-white">
        <div className="w-2/3 p-4 flex items-center">
          <MessageSquare className="mr-2" /> 
          <h2 className="text-xl font-bold">Immigration Chatbot</h2>
        </div>
        <div className="w-1/3 p-4 flex items-center border-l border-blue-400">
          <h2 className="text-xl font-bold">Resources & Links</h2>
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left chat area - 2/3 width */}
        <div className="w-2/3 flex flex-col border-r">
          {/* Chat history */}
          <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-3/4 rounded-lg p-4 ${
                    message.role === 'assistant' 
                      ? 'bg-white border border-gray-200 shadow-sm' 
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {message.role === 'assistant' ? (
                      <MessageSquare className="h-5 w-5 mr-2" />
                    ) : (
                      <User className="h-5 w-5 mr-2" />
                    )}
                    <span className="font-semibold">
                      {message.role === 'assistant' ? 'Immigration Assistant' : 'You'}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-3/4 rounded-lg p-4 bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Immigration Assistant</span>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mx-1"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="ml-2 text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input box */}
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                className="flex-1 border rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Type your immigration question here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`px-4 py-3 rounded-r-lg flex items-center justify-center ${
                  isLoading || !input.trim() 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            
            <div className="mt-3">
              <p className="text-sm text-gray-500">Example questions:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <button 
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200"
                  onClick={() => setInput("What are the requirements for an H-1B visa?")}
                >
                  H-1B requirements
                </button>
                <button 
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200"
                  onClick={() => setInput("Can I work while on an F-1 student visa?")}
                >
                  Work on F-1 visa
                </button>
                <button 
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200"
                  onClick={() => setInput("How long does green card processing take?")}
                >
                  Green card processing
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right resource area - 1/3 width */}
        <div className="w-1/3 bg-gray-50 overflow-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Helpful Resources</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" /> 
                  Documents & Guides
                </h4>
                <ul className="space-y-3">
                  {resources.filter(r => r.type === 'pdf').map((resource, index) => (
                    <li key={`pdf-${index}`}>
                      <a 
                        href={resource.link} 
                        className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Link className="h-4 w-4 mr-2 text-blue-500" /> 
                  Useful Links
                </h4>
                <ul className="space-y-3">
                  {resources.filter(r => r.type === 'link').map((resource, index) => (
                    <li key={`link-${index}`}>
                      <a 
                        href={resource.link} 
                        className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">Need more help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  For complex immigration matters, consider consulting with an immigration lawyer.
                </p>
                <button 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                  onClick={navigateToLawyerConnection}
                >
                  Connect with a lawyer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;