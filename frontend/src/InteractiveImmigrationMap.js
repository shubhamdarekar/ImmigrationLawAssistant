import React, { useState } from 'react';

const InteractiveImmigrationMap = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
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
    'minorchild': {
      title: 'Unmarried Children Under 21 of a U.S. Citizen',
      eligibility: 'Must be under 21 years of age and unmarried. Includes biological children, stepchildren, and legally adopted children.',
      timeframe: 'Processing typically takes 12-18 months for adjustment of status cases.',
      process: [
        'U.S. citizen parent files Form I-130',
        'File Form I-485 concurrently (if in the U.S.) or proceed with consular processing',
        'Attend biometrics appointment',
        'Possibly attend an interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Children who turn 21 during the process may be protected by the Child Status Protection Act (CSPA) in certain circumstances.'
    },
    'parents': {
      title: 'Parents of a U.S. Citizen',
      eligibility: 'The U.S. citizen must be at least 21 years old to petition for a parent. The parent-child relationship must be established.',
      timeframe: 'Processing typically takes 12-18 months for adjustment of status cases.',
      process: [
        'U.S. citizen files Form I-130',
        'Parent files Form I-485 (if in the U.S.) or proceeds with consular processing',
        'Attend biometrics appointment',
        'Attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Parents who entered the U.S. without inspection may need a waiver (I-601/I-601A) to adjust status or may need to process through a consulate.'
    },
    'first-preference': {
      title: 'Unmarried Sons and Daughters of U.S. Citizens (F1)',
      eligibility: 'Unmarried sons and daughters (21 years or older) of U.S. citizens.',
      timeframe: 'Several years of waiting due to visa quota limitations. Check the Visa Bulletin for current priority dates.',
      process: [
        'U.S. citizen parent files Form I-130',
        'Wait for priority date to become current',
        'File Form I-485 or proceed with consular processing when eligible',
        'Attend biometrics appointment and interview',
        'Receive Green Card upon approval'
      ],
      notes: 'If the beneficiary marries during the process, the petition moves to the F3 category (longer wait times).'
    },
    'second-preference-a': {
      title: 'Spouses and Children of Permanent Residents (F2A)',
      eligibility: 'Spouses and unmarried children (under 21) of U.S. lawful permanent residents.',
      timeframe: 'Typically 2-3 years waiting time, but varies based on country of chargeability.',
      process: [
        'Permanent resident files Form I-130',
        'Wait for priority date to become current',
        'File Form I-485 or proceed with consular processing when eligible',
        'Attend biometrics appointment and interview',
        'Receive Green Card upon approval'
      ],
      notes: 'If the petitioner naturalizes during the process, the beneficiary may be eligible to upgrade to immediate relative category (no quota).'
    },
    'second-preference-b': {
      title: 'Unmarried Sons and Daughters of Permanent Residents (F2B)',
      eligibility: 'Unmarried sons and daughters (21 years or older) of U.S. lawful permanent residents.',
      timeframe: 'Typically 6-8 years waiting time, but varies based on country of chargeability.',
      process: [
        'Permanent resident files Form I-130',
        'Wait for priority date to become current',
        'File Form I-485 or proceed with consular processing when eligible',
        'Attend biometrics appointment and interview',
        'Receive Green Card upon approval'
      ],
      notes: 'If the petitioner naturalizes, the petition automatically converts to F1 category, which may result in a shorter or longer wait time depending on country of chargeability.'
    },
    'third-preference': {
      title: 'Married Sons and Daughters of U.S. Citizens (F3)',
      eligibility: 'Married sons and daughters of U.S. citizens, regardless of age.',
      timeframe: 'Typically 10-15 years waiting time, but varies based on country of chargeability.',
      process: [
        'U.S. citizen parent files Form I-130',
        'Wait for priority date to become current',
        'File Form I-485 or proceed with consular processing when eligible',
        'Attend biometrics appointment and interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Spouses and children of the married son or daughter may qualify for derivative status.'
    },
    'fourth-preference': {
      title: 'Brothers and Sisters of U.S. Citizens (F4)',
      eligibility: 'Brothers and sisters of U.S. citizens. The U.S. citizen must be at least 21 years old.',
      timeframe: 'Typically 12-25 years waiting time, depending on country of chargeability.',
      process: [
        'U.S. citizen sibling files Form I-130',
        'Wait for priority date to become current',
        'File Form I-485 or proceed with consular processing when eligible',
        'Attend biometrics appointment and interview',
        'Receive Green Card upon approval'
      ],
      notes: 'This category has one of the longest waiting times. Spouses and children of the brother or sister may qualify for derivative status.'
    },
    'eb1a': {
      title: 'Persons with Extraordinary Ability (EB-1A)',
      eligibility: 'Foreign nationals with extraordinary ability in sciences, arts, education, business, or athletics. Must show sustained national or international acclaim.',
      timeframe: 'Usually 8-16 months, may be faster with premium processing for I-140.',
      process: [
        'Self-petition by filing Form I-140 with evidence of extraordinary ability',
        'File Form I-485 concurrently or after I-140 approval if visa number is available',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'No labor certification (PERM) required. Must demonstrate extraordinary ability through major awards or at least 3 of 10 specific criteria.'
    },
    'eb1b': {
      title: 'Outstanding Professors and Researchers (EB-1B)',
      eligibility: 'Professors or researchers with at least 3 years of experience who are internationally recognized in their academic field.',
      timeframe: 'Usually 8-16 months, may be faster with premium processing for I-140.',
      process: [
        'Employer files Form I-140',
        'File Form I-485 concurrently or after I-140 approval if visa number is available',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'No labor certification (PERM) required. Must have a permanent job offer from a university or private employer with an established research department.'
    },
    'eb1c': {
      title: 'Multinational Executives and Managers (EB-1C)',
      eligibility: 'Executives or managers who have worked for a foreign affiliate, subsidiary, or parent company outside the U.S. for at least 1 year within the 3 years prior to transfer to the U.S.',
      timeframe: 'Usually 8-16 months, may be faster with premium processing for I-140.',
      process: [
        'U.S. employer files Form I-140',
        'File Form I-485 concurrently or after I-140 approval if visa number is available',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'No labor certification (PERM) required. The U.S. and foreign companies must have a qualifying relationship.'
    },
    'eb2-advanced': {
      title: 'Professionals with Advanced Degrees (EB-2)',
      eligibility: 'Professionals with an advanced degree (beyond bachelor\'s) or bachelor\'s degree plus 5 years of progressive experience.',
      timeframe: 'Typically 1.5-3 years including PERM labor certification process.',
      process: [
        'Employer files PERM labor certification with Department of Labor',
        'After PERM approval, employer files Form I-140',
        'File Form I-485 when priority date is current',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Subject to visa backlogs for certain countries (e.g., India and China). Employer must prove that no qualified U.S. workers are available.'
    },
    'eb2-exceptional': {
      title: 'Persons with Exceptional Ability (EB-2)',
      eligibility: 'Individuals with exceptional ability in the sciences, arts, or business, which is significantly above that ordinarily encountered in their field.',
      timeframe: 'Typically 1.5-3 years including PERM labor certification process.',
      process: [
        'Employer files PERM labor certification with Department of Labor',
        'After PERM approval, employer files Form I-140',
        'File Form I-485 when priority date is current',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Must demonstrate exceptional ability through at least 3 of 6 specific criteria. Subject to visa backlogs for certain countries.'
    },
    'eb2-nin': {
      title: 'National Interest Waiver (NIW)',
      eligibility: 'Professionals with advanced degrees or exceptional ability whose work is in the national interest of the United States.',
      timeframe: 'Usually 12-18 months for I-140 approval plus I-485 processing time.',
      process: [
        'Self-petition by filing Form I-140 with NIW request',
        'File Form I-485 concurrently or after I-140 approval if visa number is available',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'No job offer or labor certification required. Must demonstrate that the proposed endeavor has substantial merit and national importance, the applicant is well positioned to advance that endeavor, and it would be beneficial to waive the labor certification requirement.'
    },
    'eb3-professional': {
      title: 'Professionals with Bachelor\'s Degrees (EB-3)',
      eligibility: 'Professionals with a U.S. bachelor\'s degree or foreign equivalent degree that is normally required for the profession.',
      timeframe: 'Typically 2-4 years including PERM labor certification process.',
      process: [
        'Employer files PERM labor certification with Department of Labor',
        'After PERM approval, employer files Form I-140',
        'File Form I-485 when priority date is current',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Subject to visa backlogs, especially for applicants born in India and China. Position must require at least a bachelor\'s degree.'
    },
    'eb3-skilled': {
      title: 'Skilled Workers (EB-3)',
      eligibility: 'Workers with at least 2 years of job experience or training.',
      timeframe: 'Typically 2-4 years including PERM labor certification process.',
      process: [
        'Employer files PERM labor certification with Department of Labor',
        'After PERM approval, employer files Form I-140',
        'File Form I-485 when priority date is current',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Subject to visa backlogs, especially for applicants born in India and China. The job must require at least 2 years of training or experience.'
    },
    'eb3-other': {
      title: 'Other Workers (EB-3)',
      eligibility: 'Workers performing unskilled labor requiring less than 2 years of training or experience.',
      timeframe: 'Typically 3-8 years including PERM labor certification process, due to significant backlogs.',
      process: [
        'Employer files PERM labor certification with Department of Labor',
        'After PERM approval, employer files Form I-140',
        'File Form I-485 when priority date is current',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'This category has longer backlogs than skilled workers and professionals in the EB-3 category.'
    },
    'eb4-religious': {
      title: 'Religious Workers (EB-4)',
      eligibility: 'Ministers and non-ministers in religious vocations or occupations with at least 2 years of experience in the religious organization.',
      timeframe: 'Processing typically takes 12-18 months.',
      process: [
        'Religious organization files Form I-360',
        'File Form I-485 when eligible',
        'Attend biometrics appointment',
        'Attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'The religious worker must have been a member of the same religious denomination for at least 2 years immediately preceding the petition.'
    },
    'eb4-special': {
      title: 'Special Immigrant Juveniles (EB-4)',
      eligibility: 'Unmarried juveniles under 21 who have been abused, abandoned, or neglected by one or both parents, and have a court order declaring them dependent on the court.',
      timeframe: 'Processing varies, typically 1-3 years including state court proceedings and USCIS processing.',
      process: [
        'Obtain order from juvenile court with required findings',
        'File Form I-360 for SIJS classification',
        'After I-360 approval, file Form I-485 when visa number is available',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Cannot petition for parents after obtaining Green Card through SIJS.'
    },
    'eb4-others': {
      title: 'Other Special Immigrants (EB-4)',
      eligibility: 'Various categories including certain broadcasters, G-4 international organization employees, Armed Forces members, etc.',
      timeframe: 'Processing varies by specific category, typically 12-24 months.',
      process: [
        'File Form I-360 specific to the special immigrant category',
        'File Form I-485 when eligible',
        'Attend biometrics appointment',
        'Attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Requirements vary significantly based on the specific special immigrant category.'
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
    'eb5-direct': {
      title: 'EB-5 Direct Investment',
      eligibility: 'Investment of at least $800,000 (in high unemployment or rural area) or $1,050,000 (in other areas) in a new commercial enterprise that creates at least 10 full-time jobs for qualifying U.S. workers.',
      timeframe: 'Processing times typically range from 3-5 years, including I-526 and I-485/consular processing time.',
      process: [
        'Create or invest in a new commercial enterprise',
        'File Form I-526 petition',
        'After I-526 approval, file I-485 or proceed with consular processing',
        'Receive conditional Green Card',
        'File I-829 to remove conditions after 2 years',
        'Receive permanent Green Card'
      ],
      notes: 'Direct investment requires active management of the business and direct job creation (employees on the company\'s payroll).'
    },
    'refugee-path': {
      title: 'Refugee Admission and Adjustment',
      eligibility: 'Individuals granted refugee status can apply for permanent residence one year after arrival in the U.S.',
      timeframe: 'Processing typically takes 8-14 months after the one-year waiting period.',
      process: [
        'Enter the U.S. as a refugee',
        'Wait one year from date of admission',
        'File Form I-485 (adjustment application)',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Time spent as a refugee counts toward the 5-year requirement for naturalization. Refugees are required by law to apply for a Green Card after one year.'
    },
    'asylee-path': {
      title: 'Asylum Status and Adjustment',
      eligibility: 'Individuals granted asylum can apply for permanent residence one year after being granted asylum.',
      timeframe: 'Processing typically takes 8-14 months after the one-year waiting period.',
      process: [
        'Be granted asylum in the U.S.',
        'Wait one year from date asylum was granted',
        'File Form I-485 (adjustment application)',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Unlike refugees, asylees are not required to apply for a Green Card, but it is highly recommended. Time spent in asylee status counts toward the 5-year requirement for naturalization.'
    },
    't-visa': {
      title: 'T Visa Pathway to Green Card',
      eligibility: 'T visa holders who have been physically present in the U.S. for at least 3 years since the T visa approval, or who have continuously complied with any reasonable request for assistance in investigation or prosecution, or who would suffer extreme hardship if removed.',
      timeframe: 'Processing typically takes 12-24 months after meeting the eligibility requirements.',
      process: [
        'Hold T nonimmigrant status for at least 3 years or meet other requirements',
        'File Form I-485 with supporting documentation',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'T visa holders may apply for adjustment before the 3-year period if the trafficking investigation or prosecution is complete.'
    },
    'u-visa': {
      title: 'U Visa Pathway to Green Card',
      eligibility: 'U visa holders who have been physically present in the U.S. for at least 3 years since the U visa approval and have not unreasonably refused to assist in the investigation or prosecution of criminal activity.',
      timeframe: 'Processing typically takes 12-24 months after the 3-year waiting period.',
      process: [
        'Hold U nonimmigrant status for at least 3 years',
        'File Form I-485 with supporting documentation',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Must demonstrate continuous physical presence and continued cooperation with law enforcement if requested.'
    },
    'dv-process': {
      title: 'Diversity Visa Lottery Selection and Processing',
      eligibility: 'Natives of countries with historically low rates of immigration to the U.S. who meet education or work requirements (high school education or 2 years of qualifying work experience).',
      timeframe: 'Annual lottery with winners having one fiscal year to complete processing.',
      process: [
        'Enter the DV lottery during the registration period',
        'Check if selected when results are announced',
        'If selected, submit DS-260 immigrant visa application',
        'Gather required documents and attend medical examination',
        'Attend interview at U.S. embassy or consulate',
        'If in the U.S., may be eligible to adjust status through Form I-485',
        'Receive visa or Green Card upon approval'
      ],
      notes: 'Limited number of visas available annually (55,000). Selection in the lottery does not guarantee a visa as more people are selected than visas available.'
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
    'sijs-path': {
      title: 'Special Immigrant Juvenile Status',
      eligibility: 'Unmarried individuals under 21 who have been abused, abandoned, or neglected by one or both parents, and have a juvenile court order declaring them dependent on the court or placing them under the custody of a state agency or individual.',
      timeframe: 'Processing varies, typically 1-3 years including state court proceedings and USCIS processing.',
      process: [
        'Obtain order from juvenile court with required findings',
        'File Form I-360 for SIJS classification',
        'After I-360 approval, file Form I-485 when visa number is available',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Significant backlogs exist for certain countries. Cannot petition for parents after obtaining Green Card through SIJS.'
    },
    'registry-path': {
      title: 'Registry for Certain Long-term Residents',
      eligibility: 'Individuals who have resided continuously in the U.S. since before January 1, 1972, and who meet certain other requirements.',
      timeframe: 'Processing typically takes 12-18 months.',
      process: [
        'File Form I-485 with evidence of continuous residence since before January 1, 1972',
        'Attend biometrics appointment',
        'Attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Must demonstrate good moral character and eligibility for naturalization (except for the 5-year permanent residency requirement).'
    },
    'cuban-path': {
      title: 'Cuban Adjustment Act',
      eligibility: 'Cuban natives or citizens who have been admitted or paroled into the U.S. and have been physically present in the U.S. for at least one year.',
      timeframe: 'Processing typically takes 8-14 months.',
      process: [
        'Be admitted or paroled into the U.S.',
        'Remain in the U.S. for at least one year',
        'File Form I-485 with supporting documentation',
        'Attend biometrics appointment',
        'Attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Spouses and unmarried children of the Cuban applicant may also qualify, regardless of their nationality or citizenship.'
    },
    'haitian-path': {
      title: 'Haitian Refugee Immigration Fairness Act',
      eligibility: 'Haitian nationals who were in the U.S. before December 31, 1995, and have been continuously present since that time, or who were orphaned and in INS custody before December 31, 1995.',
      timeframe: 'Processing typically takes 12-18 months.',
      process: [
        'File Form I-485 with evidence of Haitian nationality and continuous presence',
        'Attend biometrics appointment',
        'Attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Spouses and children of eligible Haitians may also qualify for adjustment of status under certain conditions.'
    },
    'lautenberg-path': {
      title: 'Lautenberg Parolees',
      eligibility: 'Certain nationals of the former Soviet Union, Vietnam, Laos, and Cambodia who were paroled into the U.S. under the Lautenberg Amendment.',
      timeframe: 'Processing typically takes 12-18 months.',
      process: [
        'File Form I-485 one year after being paroled into the U.S.',
        'Attend biometrics appointment',
        'Attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Must have been paroled as a refugee or for humanitarian reasons.'
    },
    'nacara-path': {
      title: 'Nicaraguan Adjustment and Central American Relief Act',
      eligibility: 'Certain Nicaraguans, Cubans, Salvadorans, Guatemalans, nationals of former Soviet bloc countries, and their dependents who meet specific criteria.',
      timeframe: 'Processing typically takes the 12-18 months.',
      process: [
        'File Form I-485 (for Nicaraguans and Cubans) or Form I-881 (for others)',
        'Attend biometrics appointment',
        'Attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Different eligibility requirements and application procedures apply depending on nationality.'
    },
    'h1b-adjustment': {
      title: 'H-1B Visa Holder to Permanent Resident',
      eligibility: 'Current H-1B visa holders sponsored by their employer for permanent residency.',
      timeframe: 'Processing times typically range from 1-3 years, depending on country of birth and visa category.',
      process: [
        'Employer files labor certification (PERM) if required',
        'Employer files Form I-140 petition',
        'File Form I-485 when priority date is current',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'H-1B holders may be eligible for AC21 provisions allowing job changes after I-485 has been pending for 180+ days.'
    },
    'l1-adjustment': {
      title: 'L-1 Visa Holder to Permanent Resident',
      eligibility: 'L-1A (managers and executives) or L-1B (specialized knowledge) visa holders sponsored by their employer.',
      timeframe: 'Processing times typically range from 1-3 years.',
      process: [
        'For L-1A: Employer typically files I-140 under EB-1C category (no PERM required)',
        'For L-1B: Employer typically files PERM followed by I-140 under EB-2 or EB-3 category',
        'File Form I-485 when priority date is current',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'L-1A executives and managers have a more direct path to permanent residence through the EB-1C category, which does not require labor certification.'
    },
    'o1-adjustment': {
      title: 'O-1 Visa Holder to Permanent Resident',
      eligibility: 'O-1 visa holders with extraordinary ability in sciences, arts, education, business, or athletics.',
      timeframe: 'Processing typically takes 12-18 months, depending on visa category used.',
      process: [
        'File Form I-140 petition (typically under EB-1A category for self-petition)',
        'File Form I-485 when eligible',
        'Attend biometrics appointment',
        'Possibly attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'O-1 visa holders often qualify for EB-1A (extraordinary ability) category, which does not require labor certification or employer sponsorship.'
    },
    'student-employment': {
      title: 'Student to Employment-Based Green Card',
      eligibility: 'F-1 students who complete their studies and find an employer willing to sponsor them, typically after working on OPT.',
      timeframe: 'Varies widely depending on visa category and country of birth, typically 2-5+ years.',
      process: [
        'Complete degree program and potentially work on OPT',
        'Transition to a work visa (typically H-1B) through employer sponsorship',
        'Employer files PERM labor certification (if required)',
        'Employer files I-140 petition',
        'File I-485 when priority date is current',
        'Attend biometrics appointment and interview',
        'Receive Green Card upon approval'
      ],
      notes: 'The transition from F-1 to permanent residency usually involves an intermediate step of obtaining a work visa like H-1B.'
    },
    'student-family': {
      title: 'Student to Family-Based Green Card',
      eligibility: 'F-1 students who have a qualifying family relationship with a U.S. citizen or permanent resident.',
      timeframe: 'Varies based on the specific family category, from several months (immediate relatives) to many years (preference categories).',
      process: [
        'U.S. citizen or permanent resident family member files Form I-130',
        'Wait for priority date to become current (if applicable)',
        'File Form I-485 or process through consulate',
        'Attend biometrics appointment',
        'Attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Marriage to a U.S. citizen is the fastest family-based path. Students should maintain lawful status during the process.'
    },
    'military-service': {
      title: 'Military Service Naturalization',
      eligibility: 'Current service members or veterans of the U.S. Armed Forces who meet service requirements.',
      timeframe: 'Expedited processing typically 6-12 months.',
      process: [
        'Complete minimum service requirements',
        'Obtain Form N-426 certification from military',
        'File Form N-400 application for naturalization',
        'Attend biometrics appointment',
        'Complete naturalization interview and exam',
        'Attend oath ceremony'
      ],
      notes: 'Military members may qualify for expedited or overseas naturalization and may be exempt from certain residence and physical presence requirements.'
    },
    'military-family': {
      title: 'Family of Military Service Members',
      eligibility: 'Spouses, children, and parents of U.S. citizens serving in the U.S. Armed Forces.',
      timeframe: 'Processing typically takes 12-18 months, with potential for expedited processing in some cases.',
      process: [
        'Military member files Form I-130',
        'File Form I-485 or process through consulate',
        'Attend biometrics appointment',
        'Attend interview',
        'Receive Green Card upon approval'
      ],
      notes: 'Special provisions may apply for families of military members, including Parole in Place for certain family members who entered without inspection.'
    },
    'tps-adjustment': {
      title: 'TPS to Permanent Residency',
      eligibility: 'Current TPS holders who have an independent basis for adjustment (family, employment, etc.).',
      timeframe: 'Varies widely based on the adjustment category.',
      process: [
        'Maintain valid TPS status',
        'File appropriate petition based on eligibility category (I-130, I-140, etc.)',
        'File Form I-485 when eligible',
        'Attend biometrics appointment',
        'Attend adjustment interview',
        'Receive Green Card upon approval'
      ],
      notes: 'TPS itself is not a direct path to permanent residency, but TPS holders may adjust status through other categories if eligible.'
    }
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
  
  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4">
      <div className="p-4 mb-4 bg-blue-700 text-white rounded-lg shadow-md text-left">
        <h1 className="text-2xl font-bold text-center">U.S. Green Card Pathways Navigator</h1>
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
              <h2 className="text-xl font-bold text-blue-700 mb-2 text-left">
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

export default InteractiveImmigrationMap;