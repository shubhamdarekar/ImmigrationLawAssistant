import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigatorPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const categories = [
    {
      id: 'family',
      title: 'Family-Based',
      subtitle: 'Green Cards',
      color: '#4285f4',
      subcategories: [
        {
          id: 'immediate',
          title: 'Immediate Relatives of U.S. Citizens',
          subtitle: '(No Quota Limitations)',
          paths: [
            { id: 'spouse', title: 'Spouse of a U.S. citizen', forms: ['I-130', 'I-485'] },
            { id: 'minorchild', title: 'Unmarried children under 21 of a U.S. citizen', forms: ['I-130', 'I-485'] },
            { id: 'parents', title: 'Parents of a U.S. citizen who is at least 21 years old', forms: ['I-130', 'I-485'] }
          ]
        },
        {
          id: 'preference',
          title: 'Family Preference Categories',
          subtitle: '(Subject to Annual Quotas)',
          paths: [
            { id: 'first-preference', title: 'First Preference: Unmarried sons and daughters of U.S. citizens', forms: ['I-130', 'I-485'] },
            { id: 'second-preference-a', title: 'Second Preference (2A): Spouses and children of permanent residents', forms: ['I-130', 'I-485'] },
            { id: 'second-preference-b', title: 'Second Preference (2B): Unmarried sons and daughters of permanent residents', forms: ['I-130', 'I-485'] },
            { id: 'third-preference', title: 'Third Preference: Married sons and daughters of U.S. citizens', forms: ['I-130', 'I-485'] },
            { id: 'fourth-preference', title: 'Fourth Preference: Brothers and sisters of U.S. citizens', forms: ['I-130', 'I-485'] }
          ]
        }
      ]
    },
    {
      id: 'employment',
      title: 'Employment-Based',
      subtitle: 'Green Cards',
      color: '#0f9d58',
      subcategories: [
        {
          id: 'eb1',
          title: 'EB-1: Priority Workers',
          subtitle: 'First Preference',
          paths: [
            { id: 'eb1a', title: 'EB-1A: Persons with extraordinary ability', forms: ['I-140', 'I-485'] },
            { id: 'eb1b', title: 'EB-1B: Outstanding professors and researchers', forms: ['I-140', 'I-485'] },
            { id: 'eb1c', title: 'EB-1C: Multinational executives and managers', forms: ['I-140', 'I-485'] }
          ]
        },
        {
          id: 'eb2',
          title: 'EB-2: Professionals with Advanced Degrees',
          subtitle: 'Second Preference',
          paths: [
            { id: 'eb2-advanced', title: 'Professionals with advanced degrees', forms: ['PERM/ETA 9089', 'I-140', 'I-485'] },
            { id: 'eb2-exceptional', title: 'Persons with exceptional ability', forms: ['PERM/ETA 9089', 'I-140', 'I-485'] },
            { id: 'eb2-nin', title: 'National Interest Waiver (NIW)', forms: ['I-140', 'I-485'] }
          ]
        },
        {
          id: 'eb3',
          title: 'EB-3: Skilled Workers, Professionals, and Other Workers',
          subtitle: 'Third Preference',
          paths: [
            { id: 'eb3-professional', title: 'Professionals with bachelor\'s degrees', forms: ['PERM/ETA 9089', 'I-140', 'I-485'] },
            { id: 'eb3-skilled', title: 'Skilled workers (requiring at least 2 years training)', forms: ['PERM/ETA 9089', 'I-140', 'I-485'] },
            { id: 'eb3-other', title: 'Other workers (requiring less than 2 years training)', forms: ['PERM/ETA 9089', 'I-140', 'I-485'] }
          ]
        },
        {
          id: 'eb4',
          title: 'EB-4: Special Immigrants',
          subtitle: 'Fourth Preference',
          paths: [
            { id: 'eb4-religious', title: 'Religious workers', forms: ['I-360', 'I-485'] },
            { id: 'eb4-special', title: 'Special immigrant juveniles', forms: ['I-360', 'I-485'] },
            { id: 'eb4-others', title: 'Other special immigrants', forms: ['I-360', 'I-485'] }
          ]
        },
        {
          id: 'eb5',
          title: 'EB-5: Immigrant Investors',
          subtitle: 'Fifth Preference',
          paths: [
            { id: 'eb5-regional', title: 'Regional center investment ($800,000 or $1,050,000)', forms: ['I-526', 'I-485', 'I-829'] },
            { id: 'eb5-direct', title: 'Direct investment ($800,000 or $1,050,000)', forms: ['I-526', 'I-485', 'I-829'] }
          ]
        }
      ]
    },
    {
      id: 'humanitarian',
      title: 'Humanitarian',
      subtitle: 'Protection Pathways',
      color: '#db4437',
      subcategories: [
        {
          id: 'refugee',
          title: 'Refugees',
          paths: [
            { id: 'refugee-path', title: 'Refugee Admission and Adjustment', forms: ['I-590', 'I-730', 'I-485'] }
          ]
        },
        {
          id: 'asylee',
          title: 'Asylees',
          paths: [
            { id: 'asylee-path', title: 'Asylum Status and Adjustment', forms: ['I-589', 'I-730', 'I-485'] }
          ]
        },
        {
          id: 'tvisa',
          title: 'Human Trafficking Victims',
          subtitle: 'T Nonimmigrant Status',
          paths: [
            { id: 't-visa', title: 'T Visa Pathway to Green Card', forms: ['I-914', 'I-485'] }
          ]
        },
        {
          id: 'uvisa',
          title: 'Crime Victims',
          subtitle: 'U Nonimmigrant Status',
          paths: [
            { id: 'u-visa', title: 'U Visa Pathway to Green Card', forms: ['I-918', 'I-485'] }
          ]
        },
        {
          id: 'tps',
          title: 'Temporary Protected Status',
          subtitle: 'TPS Holders',
          paths: [
            { id: 'tps-adjustment', title: 'TPS to Permanent Residency (if eligible)', forms: ['I-485'] }
          ]
        }
      ]
    },
    {
      id: 'diversity',
      title: 'Diversity Visa',
      subtitle: 'Lottery Program',
      color: '#f4b400',
      subcategories: [
        {
          id: 'dv-lottery',
          title: 'Diversity Immigrant Visa Program',
          subtitle: '55,000 Visas Annually',
          paths: [
            { id: 'dv-process', title: 'Diversity Visa Lottery Selection and Processing', forms: ['DS-260', 'I-485'] }
          ]
        }
      ]
    },
    {
      id: 'special',
      title: 'Special Categories',
      subtitle: 'Other Pathways',
      color: '#9c27b0',
      subcategories: [
        {
          id: 'vawa',
          title: 'VAWA Self-Petitioners',
          subtitle: 'Violence Against Women Act',
          paths: [
            { id: 'vawa-path', title: 'VAWA Self-Petition Process', forms: ['I-360', 'I-485'] }
          ]
        },
        {
          id: 'sijs',
          title: 'Special Immigrant Juveniles',
          subtitle: 'SIJS',
          paths: [
            { id: 'sijs-path', title: 'Special Immigrant Juvenile Status', forms: ['I-360', 'I-485'] }
          ]
        },
        {
          id: 'registry',
          title: 'Registry',
          subtitle: 'Long-term Residents',
          paths: [
            { id: 'registry-path', title: 'Registry for Certain Long-term Residents', forms: ['I-485'] }
          ]
        },
        {
          id: 'country-specific',
          title: 'Country-Specific Programs',
          subtitle: 'Special Legislation',
          paths: [
            { id: 'cuban-path', title: 'Cuban Adjustment Act', forms: ['I-485'] },
            { id: 'haitian-path', title: 'Haitian Refugee Immigration Fairness Act', forms: ['I-485'] },
            { id: 'lautenberg-path', title: 'Lautenberg Parolees', forms: ['I-485'] },
            { id: 'nacara-path', title: 'Nicaraguan Adjustment and Central American Relief Act', forms: ['I-485'] }
          ]
        }
      ]
    },
    {
      id: 'nonimmigrant-adjustment',
      title: 'Nonimmigrant to Immigrant',
      subtitle: 'Status Adjustment',
      color: '#795548',
      subcategories: [
        {
          id: 'work-visa-adjustment',
          title: 'Work Visa Holders',
          subtitle: 'Adjustment Options',
          paths: [
            { id: 'h1b-adjustment', title: 'H-1B Visa Holders', forms: ['I-140', 'I-485'] },
            { id: 'l1-adjustment', title: 'L-1 Visa Holders', forms: ['I-140', 'I-485'] },
            { id: 'o1-adjustment', title: 'O-1 Visa Holders', forms: ['I-140', 'I-485'] }
          ]
        },
        {
          id: 'student-adjustment',
          title: 'Students and Exchange Visitors',
          subtitle: 'F-1, J-1, M-1 Visas',
          paths: [
            { id: 'student-employment', title: 'Student to Employment-Based Green Card', forms: ['I-140', 'I-485'] },
            { id: 'student-family', title: 'Student to Family-Based Green Card', forms: ['I-130', 'I-485'] }
          ]
        }
      ]
    },
    {
      id: 'military',
      title: 'Military Pathways',
      subtitle: 'Service Members',
      color: '#03a9f4',
      subcategories: [
        {
          id: 'military-naturalization',
          title: 'Military Service Members and Veterans',
          paths: [
            { id: 'military-service', title: 'Military Service Naturalization', forms: ['N-400', 'N-426'] },
            { id: 'military-family', title: 'Family of Military Service Members', forms: ['I-130', 'I-485'] }
          ]
        }
      ]
    }
  ];

  const formDescriptions = {
    'I-130': 'Petition for Alien Relative - Used to establish relationship to a U.S. citizen or permanent resident',
    'I-140': 'Immigrant Petition for Alien Worker - Filed by an employer',
    'I-360': 'Petition for Special Immigrant - Used by VAWA self-petitioners, religious workers, etc.',
    'I-485': 'Application to Register Permanent Residence or Adjust Status - Used to apply for a Green Card',
    'I-526': 'Immigrant Petition by Alien Entrepreneur - Used for EB-5 investor category',
    'I-589': 'Application for Asylum and for Withholding of Removal',
    'I-590': 'Registration for Classification as Refugee - Used for overseas refugee processing',
    'I-730': 'Refugee/Asylee Relative Petition',
    'I-829': 'Petition by Entrepreneur to Remove Conditions',
    'I-914': 'Application for T Nonimmigrant Status - For victims of human trafficking',
    'I-918': 'Petition for U Nonimmigrant Status - For victims of certain crimes',
    'DS-260': 'Immigrant Visa Electronic Application - For processing outside the U.S.',
    'PERM/ETA 9089': 'Permanent Labor Certification Application - First step for EB-2 and EB-3 categories',
    'N-400': 'Application for Naturalization - For eligible permanent residents seeking citizenship',
    'N-426': 'Request for Certification of Military or Naval Service - Required for military naturalization'
  };

  const pathDetails = {
    // ...existing pathDetails...
  };

  const selectCategory = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedPath(null);
      setShowDetails(false);
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(null);
      setSelectedPath(null);
      setShowDetails(false);
    }
  };

  const selectSubcategory = (subcategoryId) => {
    if (selectedSubcategory === subcategoryId) {
      setSelectedSubcategory(null);
      setSelectedPath(null);
      setShowDetails(false);
    } else {
      setSelectedSubcategory(subcategoryId);
      setSelectedPath(null);
      setShowDetails(false);
    }
  };

  const selectPath = (category, subcategory, path) => {
    setSelectedPath({
      categoryId: category.id,
      subcategoryId: subcategory.id,
      pathId: path.id,
      title: path.title,
      category: category.title,
      subcategory: subcategory.title,
      forms: path.forms
    });
    setShowDetails(true);
  };

  const handleChatClick = () => {
    if (selectedPath) {
      navigate('/chatbot', { 
        state: { 
          category: selectedPath.category,
          subcategory: selectedPath.subcategory,
          pathway: selectedPath.title,
          forms: selectedPath.forms
        }
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4">
      <div className="p-4 mb-4 bg-blue-700 text-white rounded-lg shadow-md text-left">
        <h1 className="text-2xl font-bold text-center">Navigator</h1>
        <p className="text-center">Click on categories to explore different immigration paths</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200 text-left">
            <h2 className="text-xl font-bold text-blue-700 text-center">Green Card Eligibility Categories</h2>
            <p className="text-sm text-gray-600 text-center">Select a category to explore pathways</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 p-4">
            {categories.map((category) => (
              <div key={category.id} className="w-full text-left">
                <div 
                  className={`p-4 rounded-lg cursor-pointer transition-colors flex justify-between items-center ${selectedCategory === category.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  style={{ borderLeft: `4px solid ${category.color}` }}
                  onClick={() => selectCategory(category.id)}
                >
                  <div className="text-left w-full">
                    <h3 className="font-bold text-left">{category.title}</h3>
                    <p className="text-sm text-gray-600 text-left">{category.subtitle}</p>
                  </div>
                  <div className="text-gray-400 flex-shrink-0 ml-2">
                    {selectedCategory === category.id ? '▼' : '▶'}
                  </div>
                </div>
                
                {selectedCategory === category.id && (
                  <div className="pl-4 mt-2 border-l-2 border-gray-200 ml-4 text-left">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="mb-2 text-left">
                        <div 
                          className={`p-3 rounded cursor-pointer transition-colors flex justify-between items-center ${selectedSubcategory === subcategory.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                          onClick={() => selectSubcategory(subcategory.id)}
                        >
                          <div className="text-left w-full">
                            <h4 className="font-medium text-left">{subcategory.title}</h4>
                            {subcategory.subtitle && (
                              <p className="text-xs text-gray-500 text-left">{subcategory.subtitle}</p>
                            )}
                          </div>
                          <div className="text-gray-400 flex-shrink-0 ml-2">
                            {selectedSubcategory === subcategory.id ? '▼' : '▶'}
                          </div>
                        </div>
                        
                        {selectedSubcategory === subcategory.id && (
                          <div className="pl-4 border-l-2 border-gray-100 ml-2 text-left">
                            {subcategory.paths.map((path) => (
                              <div 
                                key={path.id}
                                className={`p-2 my-1 rounded text-sm cursor-pointer text-left ${selectedPath && selectedPath.pathId === path.id ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-gray-50'}`}
                                onClick={() => selectPath(category, subcategory, path)}
                              >
                                {path.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-1/3">
          {showDetails && selectedPath ? (
            <div className="bg-white p-4 rounded-lg shadow-md text-left">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-blue-700 mb-2 text-left">
                    {selectedPath.title}
                  </h2>
                  <div className="flex gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {selectedPath.category}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {selectedPath.subcategory}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleChatClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center h-10 ml-4 flex-shrink-0"
                >
                  <span className="mr-2">💬</span>
                  Chat about this
                </button>
              </div>
              
              {pathDetails[selectedPath.pathId] ? (
                <div className="space-y-4 text-left">
                  <div className="text-left">
                    <h3 className="font-bold text-gray-700 text-left">Eligibility Requirements</h3>
                    <p className="text-sm text-left">{pathDetails[selectedPath.pathId].eligibility}</p>
                  </div>
                  
                  <div className="text-left">
                    <h3 className="font-bold text-gray-700 text-left">Processing Timeframe</h3>
                    <p className="text-sm text-left">{pathDetails[selectedPath.pathId].timeframe}</p>
                  </div>
                  
                  <div className="text-left">
                    <h3 className="font-bold text-gray-700 text-left">Application Process</h3>
                    <ol className="list-decimal list-inside text-sm text-left">
                      {pathDetails[selectedPath.pathId].process.map((step, i) => (
                        <li key={i} className="ml-2 text-left">{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="text-left">
                    <h3 className="font-bold text-gray-700 text-left">Special Notes</h3>
                    <p className="text-sm text-left">{pathDetails[selectedPath.pathId].notes}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded border border-gray-200 text-left">
                  <p className="text-gray-500 italic text-sm text-left">Detailed information for this pathway is currently being compiled. Please check back later.</p>
                  
                  <p className="mt-2 text-sm text-left">This pathway typically requires the following forms:</p>
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-600 text-left">
                    {selectedPath.forms.map((form) => (
                      <li key={form} className="text-left">{form}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-4 text-left">
                <h3 className="font-bold text-gray-700 text-left">Required Forms</h3>
                <div className="space-y-2 mt-2">
                  {selectedPath.forms.map((form) => (
                    <div key={form} className="bg-gray-100 p-2 rounded text-left">
                      <span className="font-bold text-blue-700 text-left">{form}:</span> {formDescriptions[form]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-center py-8">
                <h2 className="text-xl font-bold text-gray-700 mb-2">Immigration Pathway Details</h2>
                <p className="text-gray-500 mb-4">Select a specific pathway from the navigation menu to view detailed information</p>
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-gray-400">📋</span>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Learn about eligibility requirements, application process, required forms, and processing times
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-white p-4 rounded-lg shadow-md mt-4 text-left">
            <h3 className="font-bold text-gray-700 mb-2 text-left">Immigration Resources</h3>
            <div className="space-y-2 text-sm">
              <a href="https://www.uscis.gov/green-card" target="_blank" rel="noopener noreferrer" className="block p-2 bg-blue-50 hover:bg-blue-100 rounded flex items-center text-left">
                <span className="mr-2">🔗</span> Official USCIS Green Card Information
              </a>
              <a href="https://www.uscis.gov/forms/all-forms" target="_blank" rel="noopener noreferrer" className="block p-2 bg-blue-50 hover:bg-blue-100 rounded flex items-center text-left">
                <span className="mr-2">📄</span> USCIS Forms and Instructions
              </a>
              <a href="https://egov.uscis.gov/processing-times/" target="_blank" rel="noopener noreferrer" className="block p-2 bg-blue-50 hover:bg-blue-100 rounded flex items-center text-left">
                <span className="mr-2">⏱️</span> Check USCIS Processing Times
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-gray-500 text-xs">
        Note: Immigration requirements and processes may change. Always verify information with official USCIS sources.
      </div>
    </div>
  );
};

export default NavigatorPage;