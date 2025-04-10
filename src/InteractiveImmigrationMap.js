import React, { useState } from 'react';

const VerticalImmigrationMap = () => {
  // State to track selected category and path
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Category data structure
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
          id: 'other-special',
          title: 'Other Special Categories',
          paths: [
            { id: 'cuban-path', title: 'Cuban Adjustment Act', forms: ['I-485'] },
            { id: 'haitian-path', title: 'Haitian Refugee Immigration Fairness Act', forms: ['I-485'] },
            { id: 'lautenberg-path', title: 'Lautenberg Parolees', forms: ['I-485'] }
          ]
        }
      ]
    }
  ];
  
  // Form descriptions for details panel
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
    'PERM/ETA 9089': 'Permanent Labor Certification Application - First step for EB-2 and EB-3 categories'
  };
  
  // Path details for display
  const pathDetails = {
    'spouse': {
      title: 'Spouse of a U.S. Citizen',
      eligibility: 'Must be legally married to a U.S. citizen. The marriage must be bona fide (genuine).',
      timeframe: 'Processing times typically range from 12-24 months, depending on the service center and current workload.',
      process: [
        'U.S. citizen files Form I-130 (Petition for Alien Relative)',
        'Concurrently or later, file Form I-485 (Adjustment of Status) if in the U.S.',
        'Attend biometrics appointment',
        'Attend immigration interview (typically together with spouse)',
        'Receive Green Card upon approval'
      ],
      notes: 'If marriage is less than 2 years old at the time of approval, a 2-year conditional Green Card is issued, requiring Form I-751 to remove conditions later.'
    },
    'eb5-regional': {
      title: 'EB-5 Regional Center Investment',
      eligibility: 'Investment of at least $800,000 (in high unemployment or rural area) or $1,050,000 (in other areas) in an approved regional center project that creates at least 10 full-time jobs.',
      timeframe: 'Processing times typically range from 3-5 years, including I-526 and I-485/consular processing time.',
      process: [
        'Select an approved regional center project and make investment',
        'File Form I-526 petition',
        'After I-526 approval, file I-485 or proceed with consular processing',
        'Receive conditional Green Card',
        'File I-829 to remove conditions after 2 years',
        'Receive permanent Green Card'
      ],
      notes: 'Regional center investments are typically more passive and allow for indirect job creation, but require careful due diligence to avoid fraudulent projects.'
    },
    'vawa-path': {
      title: 'VAWA Self-Petition (Violence Against Women Act)',
      eligibility: 'Spouse, child, or parent of a U.S. citizen or permanent resident who has been abused or subjected to extreme cruelty.',
      timeframe: 'Processing times typically range from 18-24 months.',
      process: [
        'File Form I-360 self-petition',
        'After I-360 approval, file Form I-485 for adjustment of status',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'VAWA petitions are confidential and the abuser will not be notified. Petitioners may be eligible for work authorization and certain benefits.'
    },
    // More path details can be added as needed
  };
  
  // Select a category
  const selectCategory = (categoryId) => {
    if (selectedCategory === categoryId) {
      // If clicking the same category, collapse it
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedPath(null);
      setShowDetails(false);
    } else {
      // Select new category and reset others
      setSelectedCategory(categoryId);
      setSelectedSubcategory(null);
      setSelectedPath(null);
      setShowDetails(false);
    }
  };
  
  // Select a subcategory
  const selectSubcategory = (subcategoryId) => {
    if (selectedSubcategory === subcategoryId) {
      // If clicking the same subcategory, collapse it
      setSelectedSubcategory(null);
      setSelectedPath(null);
      setShowDetails(false);
    } else {
      // Select new subcategory
      setSelectedSubcategory(subcategoryId);
      setSelectedPath(null);
      setShowDetails(false);
    }
  };
  
  // Select a path
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
  
  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4">
      <div className="p-4 mb-4 bg-blue-700 text-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">U.S. Green Card Pathways Navigator</h1>
        <p className="text-center">Click on categories to explore different immigration paths</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left side - Vertical Navigation */}
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-blue-700">Green Card Eligibility Categories</h2>
            <p className="text-sm text-gray-600">Select a category to explore pathways</p>
          </div>
          
          {/* Main Category Grid */}
          <div className="grid grid-cols-1 gap-4 p-4">
            {/* Categories */}
            {categories.map((category) => (
              <div key={category.id} className="w-full">
                {/* Category header */}
                <div 
                  className={`p-4 rounded-lg cursor-pointer transition-colors flex justify-between items-center ${selectedCategory === category.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  style={{ borderLeft: `4px solid ${category.color}` }}
                  onClick={() => selectCategory(category.id)}
                >
                  <div>
                    <h3 className="font-bold">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.subtitle}</p>
                  </div>
                  <div className="text-gray-400">
                    {selectedCategory === category.id ? '▼' : '▶'}
                  </div>
                </div>
                
                {/* Subcategories (shown when category is selected) */}
                {selectedCategory === category.id && (
                  <div className="pl-4 mt-2 border-l-2 border-gray-200 ml-4">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="mb-2">
                        {/* Subcategory header */}
                        <div 
                          className={`p-3 rounded cursor-pointer transition-colors flex justify-between items-center ${selectedSubcategory === subcategory.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                          onClick={() => selectSubcategory(subcategory.id)}
                        >
                          <div>
                            <h4 className="font-medium">{subcategory.title}</h4>
                            {subcategory.subtitle && (
                              <p className="text-xs text-gray-500">{subcategory.subtitle}</p>
                            )}
                          </div>
                          <div className="text-gray-400">
                            {selectedSubcategory === subcategory.id ? '▼' : '▶'}
                          </div>
                        </div>
                        
                        {/* Paths (shown when subcategory is selected) */}
                        {selectedSubcategory === subcategory.id && (
                          <div className="pl-4 border-l-2 border-gray-100 ml-2">
                            {subcategory.paths.map((path) => (
                              <div 
                                key={path.id}
                                className={`p-2 my-1 rounded text-sm cursor-pointer ${selectedPath && selectedPath.pathId === path.id ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-gray-50'}`}
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
        
        {/* Right side - Details Panel */}
        <div className="w-full lg:w-1/3">
          {showDetails && selectedPath ? (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-blue-700 mb-2">
                {selectedPath.title}
              </h2>
              <div className="flex gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {selectedPath.category}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {selectedPath.subcategory}
                </span>
              </div>
              
              {/* Path details */}
              {pathDetails[selectedPath.pathId] ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-700">Eligibility Requirements</h3>
                    <p className="text-sm">{pathDetails[selectedPath.pathId].eligibility}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-700">Processing Timeframe</h3>
                    <p className="text-sm">{pathDetails[selectedPath.pathId].timeframe}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-700">Application Process</h3>
                    <ol className="list-decimal list-inside text-sm">
                      {pathDetails[selectedPath.pathId].process.map((step, i) => (
                        <li key={i} className="ml-2">{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-700">Special Notes</h3>
                    <p className="text-sm">{pathDetails[selectedPath.pathId].notes}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                  <p className="text-gray-500 italic text-sm">Detailed information for this pathway is currently being compiled. Please check back later.</p>
                  
                  <p className="mt-2 text-sm">This pathway typically requires the following forms:</p>
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                    {selectedPath.forms.map((form) => (
                      <li key={form}>{form}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Required forms */}
              <div className="mt-4">
                <h3 className="font-bold text-gray-700">Required Forms</h3>
                <div className="space-y-2 mt-2">
                  {selectedPath.forms.map((form) => (
                    <div key={form} className="bg-gray-100 p-2 rounded">
                      <span className="font-bold text-blue-700">{form}:</span> {formDescriptions[form]}
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
          
          {/* Quick guide */}
          <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h3 className="font-bold text-gray-700 mb-2">Immigration Resources</h3>
            <div className="space-y-2 text-sm">
              <a href="https://www.uscis.gov/green-card" target="_blank" rel="noopener noreferrer" className="block p-2 bg-blue-50 hover:bg-blue-100 rounded flex items-center">
                <span className="mr-2">🔗</span> Official USCIS Green Card Information
              </a>
              <a href="https://www.uscis.gov/forms/all-forms" target="_blank" rel="noopener noreferrer" className="block p-2 bg-blue-50 hover:bg-blue-100 rounded flex items-center">
                <span className="mr-2">📄</span> USCIS Forms and Instructions
              </a>
              <a href="https://egov.uscis.gov/processing-times/" target="_blank" rel="noopener noreferrer" className="block p-2 bg-blue-50 hover:bg-blue-100 rounded flex items-center">
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

export default VerticalImmigrationMap;