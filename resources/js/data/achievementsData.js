// Civic Parade Photos
import civicE from '../../Images/Civic Parade/e.jpg';
import civicQ from '../../Images/Civic Parade/q.jpg';
import civicR from '../../Images/Civic Parade/r.jpg';
import civicT from '../../Images/Civic Parade/t.jpg';
import civicU from '../../Images/Civic Parade/u.jpg';
import civicW from '../../Images/Civic Parade/w.jpg';
import civicY from '../../Images/Civic Parade/y.jpg';

// Clean-Up Drive Photos
import clean8 from '../../Images/clean up drive/8.jpg';
import clean9 from '../../Images/clean up drive/9.jpg';
import clean10 from '../../Images/clean up drive/10.jpg';
import clean11 from '../../Images/clean up drive/11.jpg';
import clean12 from '../../Images/clean up drive/12.jpg';
import clean13 from '../../Images/clean up drive/13.jpg';
import clean14 from '../../Images/clean up drive/14.jpg';

// Monitoring & Evaluation Photos
import mon1 from '../../Images/Monitoring/1.jpg';
import mon2 from '../../Images/Monitoring/2.jpg';
import mon3 from '../../Images/Monitoring/3.jpg';
import mon4 from '../../Images/Monitoring/4.jpg';

// Pre-Registration Seminar (PRS) Photos
import prs5 from '../../Images/PRS/5.jpg';
import prs6 from '../../Images/PRS/6.jpg';
import prs7 from '../../Images/PRS/7.jpg';

// Oath-Taking Ceremony Photos
import oath1 from '../../Images/Oath-Taking Ceremony/1.png';
import oath2 from '../../Images/Oath-Taking Ceremony/2.png';
import oath3 from '../../Images/Oath-Taking Ceremony/3.png';
import oath4 from '../../Images/Oath-Taking Ceremony/4.png';
import oath5 from '../../Images/Oath-Taking Ceremony/5.png';

export const ACHIEVEMENTS_CATEGORIES = [
    { key: 'all', label: 'All Achievements' },
    { key: 'governance', label: 'Governance & Council' },
    { key: 'civic', label: 'Civic & Solidarity' },
    { key: 'environment', label: 'Environmental Action' },
    { key: 'formation', label: 'Formation & Training' },
];

export const ACHIEVEMENTS_DATA = [
    {
        id: 'oath-taking-ceremony',
        slug: 'oath-taking-ceremony',
        title: 'MCDC Monthly Meeting & Oath-Taking Ceremony',
        tagline: 'May we continue to work together in the spirit of cooperation, unity, and service. 💙❤️',
        category: 'Council Governance & Leadership',
        categoryKey: 'governance',
        badge: 'Oath-Taking Milestone',
        accent: 'blue',
        accentColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
        date: 'September 17, 2026',
        periodLabel: 'Council Milestone',
        venue: 'Municipal Conference Hall, Opol, Misamis Oriental',
        leadAgency: 'MCDC Opol • LGU Opol • Office of the Municipal Mayor',
        featured: true,

        // Official English Executive Narrative
        executiveSummary:
            'The Municipal Cooperative Development Council (MCDC) successfully conducted its monthly meeting and Oath-Taking Ceremony on September 17, 2026. The activity brought together the members of the MCDC to strengthen coordination, discuss important cooperative development matters, and reaffirm their commitment to supporting and promoting the growth of cooperatives in the Municipality of Opol. Sincere gratitude is extended to Hon. Rhally Mae D. Piit, SB Member, Chairman on Livelihood and Cooperative, and Hon. Atty. Jayfrancis D. Bago, Municipal Mayor of Opol, for their continued support, guidance, and commitment to the cooperative sector. Their leadership and encouragement continue to inspire cooperative stakeholders in advancing inclusive and sustainable development in our community.',

        // Authentic Local Caption (Cebuano / Bisaya & Community Dispatch)
        localCaption: {
            headline: 'MCDC Monthly Meeting & Oath-Taking Ceremony sa Munisipyo sa Opol',
            body: 'The Municipal Cooperative Development Council (MCDC) successfully conducted its monthly meeting and Oath-Taking Ceremony on September 17, 2026.\n\nThe activity brought together the members of the MCDC to strengthen coordination, discuss important cooperative development matters, and reaffirm their commitment to supporting and promoting the growth of cooperatives in the Municipality of Opol.\n\nWe extend our sincere gratitude to Hon. Rhally Mae D. Piit, SB Member, Chairman on Livelihood and Cooperative and Hon. Atty. Jayfrancis D. Bago, Municipal Mayor of Opol, for his continued support, guidance, and commitment to the cooperative sector. Your leadership and encouragement continue to inspire our cooperative stakeholders in advancing inclusive and sustainable development in our community.\n\nCongratulations to all the newly inducted and reaffirmed members of the MCDC! May we continue to work together in the spirit of cooperation, unity, and service. 💙❤️',
            quote: 'May we continue to work together in the spirit of cooperation, unity, and service. 💙❤️',
        },

        highlights: [
            'Conducted the MCDC Monthly Meeting and official Oath-Taking Ceremony on September 17, 2026',
            'Administered with the presence and steadfast support of Municipal Mayor Hon. Atty. Jayfrancis D. Bago',
            'Co-presided by SB Member Hon. Rhally Mae D. Piit, Chairman on Livelihood and Cooperative',
            'Strengthened inter-cooperative coordination and mapped out plans for upcoming Cooperative Month 2026',
            'Inducted and reaffirmed council members committed to transparent governance and inclusive development',
        ],

        stats: [
            { label: 'Ceremony Date', value: 'Sept 17, 2026' },
            { label: 'Presiding Mayor', value: 'Atty. Jayfrancis Bago' },
            { label: 'SB Committee Chair', value: 'Hon. Rhally Mae Piit' },
            { label: 'Official Gallery', value: '5 Documented' },
        ],

        coverImage: oath1,
        gallery: [
            {
                src: oath1,
                title: 'Solemn Oath of Office Administration',
                caption: 'Newly inducted and reaffirmed MCDC officers taking their solemn oath of office before Municipal Mayor Hon. Atty. Jayfrancis D. Bago.',
            },
            {
                src: oath2,
                title: 'Council Deliberations & Leadership Address',
                caption: 'Hon. Rhally Mae D. Piit, SB Chairman on Livelihood and Cooperative, and Mayor Jayfrancis D. Bago steering strategic cooperative development matters.',
            },
            {
                src: oath3,
                title: 'Municipal Cooperative Development Council Assembly',
                caption: 'MCDC members in official council attire reaffirming unity and coordination during the session.',
            },
            {
                src: oath4,
                title: 'Pledge of Cooperative Service & Integrity',
                caption: 'Council members reading the oath of office in unison, committing to transparent governance and sustainable livelihood.',
            },
            {
                src: oath5,
                title: 'Strategic Planning for Cooperative Month 2026',
                caption: 'The full MCDC body reviewing cooperative activities and municipal initiatives for the upcoming Cooperative Month.',
            },
        ],
    },
    {
        id: 'civic-parade',
        slug: 'civic-parade',
        title: 'Municipal Civic Parade & Cooperative Solidarity Walk',
        tagline: 'One team, one goal, one heart for cooperative development.',
        category: 'Civic & Community Solidarity',
        categoryKey: 'civic',
        badge: 'Solidarity Milestone',
        accent: 'red',
        accentColor: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900',
        date: 'August 2026',
        periodLabel: 'Civic Celebration',
        venue: 'Poblacion Commercial Corridor to Municipal Hall, Opol',
        leadAgency: 'MCDO Opol • LGU Opol • Municipal Cooperatives',
        featured: true,

        // Official English Executive Narrative
        executiveSummary:
            'The Municipal Cooperative Development Office (MCDO), marching hand-in-hand with cooperative leaders, board directors, and dedicated members from across Opol’s 14 barangays, proudly participated in the grand Municipal Civic Parade. Carrying the vibrant banner of "One team, one goal, one heart for cooperative development," the contingent demonstrated the unified economic and social strength of the cooperative movement. This milestone celebrated the enduring partnership between the Local Government Unit of Opol, under Mayor Jay Francis Bago and Vice Mayor Danilo E. Daroy, Jr., and grassroots self-help organizations committed to inclusive municipal progress.',

        // Authentic Local Caption (Cebuano / Bisaya)
        localCaption: {
            headline: 'Usa ka Pundok, Usa ka Panlantaw, Usa ka Kasingkasing alang sa Kalamboan sa Kooperatiba',
            body: 'Mapasigarbohong misalmot ang Municipal Cooperative Development Office (MCDO) ug ang mga opisyales ug miyembro gikan sa nagkalain-laing kooperatiba sa lungsod sa Opol sa atong tinuig nga Civic Parade. Sa tema nga "One team, one goal, one heart for cooperative development," atong gipakita ang kalig-on sa atong panaghiusa ug ang bililhong kontribusyon sa sektor sa kooperatiba sa pag-abag sa kalamboan sa atong minahal nga lungsod. Padayon kita sa pagmartsa paabante uban ang gugma ug pagtinabangay alang sa matag Opolanon!',
            quote: 'One team, one goal, one heart for cooperative development. ❤️',
        },

        highlights: [
            'Delegation united co-op federations, agricultural groups, credit unions, and transport co-ops',
            'Reinforced solidarity with LGU Opol municipal governance and civic celebrations',
            'Raised public awareness on cooperative principles, grassroots empowerment, and livelihood programs',
            'Strong visibility across 14 barangays advancing community self-reliance',
        ],

        stats: [
            { label: 'Delegation Spirit', value: '1 Heart' },
            { label: 'Barangays Involved', value: '14 Barangays' },
            { label: 'Sector Alignment', value: '100% LGU Opol' },
            { label: 'Official Photos', value: '7 Documented' },
        ],

        coverImage: civicE,
        gallery: [
            { src: civicE, title: 'MCDO Delegation Marching Contingent', caption: 'MCDO staff and cooperative leaders marching with pride along the municipal parade corridor.' },
            { src: civicQ, title: 'Cooperative Sector Pride & Banners', caption: 'Parade contingent displaying solidarity banners and cooperative development symbols.' },
            { src: civicR, title: 'Frontline Cooperative Champions', caption: 'MCDO officers and community members standing strong for participatory local development.' },
            { src: civicT, title: 'United Movement Across Barangays', caption: 'Cooperative representatives from coastal to upland barangays celebrating community strength.' },
            { src: civicU, title: 'Civic Procession to Municipal Grounds', caption: 'The vibrant cooperative contingent arriving at the Opol Municipal Hall amphitheater.' },
            { src: civicW, title: 'Officers & Community Comradeship', caption: 'Smiles and unity among civil servants and grassroots cooperative stakeholders.' },
            { src: civicY, title: 'Solidarity Milestone Commemoration', caption: 'Commemorative group documentation of the cooperative parade assembly.' },
        ],
    },

    {
        id: 'clean-up-drive',
        slug: 'clean-up-drive',
        title: 'Municipal Cooperative Clean-Up Drive & Environmental Stewardship',
        tagline: 'Panaghiusa ug kooperasyon alang sa mas limpyo, mas luwas, ug mas maayong komunidad.',
        category: 'Environmental Stewardship',
        categoryKey: 'environment',
        badge: 'Eco-Governance',
        accent: 'emerald',
        accentColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
        date: 'July 4, 2026',
        periodLabel: 'Environmental Mission',
        venue: 'Taboc Gym & Surrounding Coastal Environs, Opol',
        leadAgency: 'MCDO Opol • Barangay Council of Taboc • Partner Co-ops',
        featured: false,

        // Official English Executive Narrative
        executiveSummary:
            'On July 4, 2026, the Municipal Cooperative Development Office mobilized cooperative officers, civic volunteers, and community champions for an intensive Clean-Up Drive centered at Taboc Gym, Opol. Grounded in the 7th Cooperative Principle ("Concern for Community") and aligned with the "Bag-ong Opol" environmental pillar as an eco-town, the drive focused on coastal and public facility waste recovery. The activity demonstrated that cooperatives are vital stewards of ecological health, combining civic responsibility with hands-on volunteer action to cultivate a safer, greener living environment for all residents.',

        // Authentic Local Caption (Cebuano / Bisaya)
        localCaption: {
            headline: 'Malampuson nga Clean-Up Drive sa Taboc Gym, Opol',
            body: 'Malampuson nga nahuman ang atong 𝐂𝐥𝐞𝐚𝐧-𝐔𝐩 𝐃𝐫𝐢𝐯𝐞 niadtong 𝐉𝐮𝐥𝐲 𝟒, 𝟐𝟎𝟐𝟔 sa 𝐓𝐚𝐛𝐨𝐜 𝐆𝐲𝐦, 𝐎𝐩𝐨𝐥. Daghang salamat sa tanang mga kooperatiba, boluntaryo, ug mga kauban nga naggahin sa ilang oras ug kusog aron magtinabangay sa paglimpyo sa atong komunidad. ❤️❤️\n\nAng inyong aktibong partisipasyon nagpamatuod nga pinaagi sa panaghiusa ug kooperasyon, daghan ta og mahimo alang sa kalikupan. Dili lang kini simpleng pagpanglimpyo, kundili usa usab ka pagpakita sa atong responsibilidad ug gugma sa kinaiyahan ug sa atong komunidad.\n\nPadayon ta sa pag-amuma sa atong palibot ug magtinabangay alang sa mas limpyo, mas luwas, ug mas maayong kaugmaon.',
            quote: 'Dili lang kini simpleng pagpanglimpyo, kundili pagpakita sa atong responsibilidad ug gugma sa kinaiyahan ug sa komunidad. ❤️❤️',
        },

        highlights: [
            'Conducted at Taboc Gym and coastal vicinities with broad multi-cooperative volunteer turnout',
            'Direct alignment with Municipal Eco-Town goals under the "Bag-ong Opol" Sustainable Development Agenda',
            'Collected and properly segregated shoreline and municipal public area solid waste',
            'Demonstrated the 7th Principle of Cooperativism: Concern for Community and Environment',
        ],

        stats: [
            { label: 'Execution Date', value: 'July 4, 2026' },
            { label: 'Assembly Point', value: 'Taboc Gym' },
            { label: 'Pillar Alignment', value: 'Eco-Town Vision' },
            { label: 'Gallery Records', value: '7 Photos' },
        ],

        coverImage: clean8,
        gallery: [
            { src: clean8, title: 'Volunteer Assembly at Taboc Gym', caption: 'Cooperative members, staff, and youth volunteers gearing up for the community clean-up drive.' },
            { src: clean9, title: 'Coordinated Coastal & Roadside Clearing', caption: 'Volunteers collecting non-biodegradable debris and clearing roadside pathways.' },
            { src: clean10, title: 'Hands-On Civic Responsibility', caption: 'Cooperative workers and MCDO staff working side-by-side in waste recovery operations.' },
            { src: clean11, title: 'Material Segregation & Ecological Sorting', caption: 'Proper handling and sorting of recovered recyclables and residual waste materials.' },
            { src: clean12, title: 'Community Spirit & Fellowship in Action', caption: 'High morale and camaraderie among community volunteers making Opol cleaner and safer.' },
            { src: clean13, title: 'Public Area Sanitization & Clean-up', caption: 'Active cleaning of common open spaces around Taboc municipal sports facilities.' },
            { src: clean14, title: 'Mission Accomplished Group Photo', caption: 'Triumphant group commemoration of cooperative volunteers who made the clean-up a resounding success.' },
        ],
    },

    {
        id: 'monitoring-evaluation',
        slug: 'monitoring-evaluation',
        title: 'Comprehensive Cooperative Monitoring & Evaluation (M&E)',
        tagline: 'Pagpalig-on sa pagdumala, operasyon, ug serbisyo alang sa kalamboan sa mga miyembro.',
        category: 'Governance & Evaluation',
        categoryKey: 'governance',
        badge: 'Statutory Governance',
        accent: 'blue',
        accentColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
        date: 'August 18, 2026',
        periodLabel: 'M&E Field Mission',
        venue: 'Tuling, Patag, and Poblacion, Opol, Misamis Oriental',
        leadAgency: 'Municipal Cooperative Development Office (MCDO) Field Evaluation Team',
        featured: false,

        // Official English Executive Narrative
        executiveSummary:
            'On August 18, 2026, the Municipal Cooperative Development Office (MCDO) spearheaded a comprehensive Monitoring and Evaluation (M&E) mission across three established community cooperatives in Opol: Tuling Coconut Farmers Multi-Purpose Cooperative, Patag Agrarian Reform Cooperative, and Misamis Oriental Farmers Credit Cooperative. The mission conducted rigorous evaluations of institutional governance, operational books of accounts, statutory compliance under CDA standards, and frontline member benefits. Through constructive diagnostic reviews, the MCDO provided tailored recommendations to strengthen management integrity, improve risk controls, and accelerate enterprise growth.',

        // Authentic Local Caption (Cebuano / Bisaya)
        localCaption: {
            headline: 'Monitoring & Evaluation (M&E) ngadto sa Tulo ka Kooperatiba sa Opol',
            body: 'Monitoring & Evaluation 🤝🌱\n\nNiadtong Agosto 18, 2026, malampuson nga nagpahigayon og Monitoring and Evaluation (M&E) ang Municipal Cooperative Development Office (MCDO) ngadto sa tulo ka kooperatiba:\n📌 Tuling Coconut Farmers Multi-Purpose Cooperative\n📌 Patag Agrarian Reform Cooperative\n📌 Misamis Oriental Farmers Credit Cooperative\n\nPinaagi niini nga monitoring ug evaluation, atong masuta ang kahimtang, kalamboan, mga nahimo, ug mga hagit nga giatubang sa matag kooperatiba. Importante kini aron mapalig-on pa ang ilang pagdumala, operasyon, ug serbisyo alang sa mga miyembro ug sa komunidad. 💙❤️\n\nDaghang salamat sa inyong mainitong pagdawat ug kooperasyon! Padayon sa pagpalambo ug pagpalig-on sa atong mga kooperatiba!',
            quote: 'Importante kini aron mapalig-on pa ang ilang pagdumala, operasyon, ug serbisyo alang sa mga miyembro ug sa komunidad. 🤝🌾',
        },

        highlights: [
            'Evaluated Tuling Coconut Farmers Multi-Purpose Cooperative on coconut value-chain and member records',
            'Reviewed Patag Agrarian Reform Cooperative on land stewardship, farm input distribution, and compliance',
            'Assessed Misamis Oriental Farmers Credit Cooperative on micro-financing governance and internal credit controls',
            'Strengthened statutory compliance to sustain Certificate of Compliance (COC) standing with the CDA',
        ],

        stats: [
            { label: 'Evaluation Date', value: 'Aug 18, 2026' },
            { label: 'Cooperatives Assessed', value: '3 Major Co-ops' },
            { label: 'Sectors Covered', value: 'Agri, Agrarian, Credit' },
            { label: 'Audit Records', value: '4 Photos' },
        ],

        coverImage: mon1,
        gallery: [
            { src: mon1, title: 'On-Site Diagnostic & Book Inspection', caption: 'MCDO evaluators examining institutional records, financial statements, and board resolutions.' },
            { src: mon2, title: 'Interface with Cooperative Board & Officers', caption: 'Constructive dialogue with cooperative leaders regarding operational achievements and pain points.' },
            { src: mon3, title: 'Agricultural & Credit Operations Review', caption: 'Reviewing operational performance metrics and loan repayment management systems.' },
            { src: mon4, title: 'Technical Guidance & Action Planning', caption: 'MCDO staff delivering tailored advisory on governance improvements and compliance timelines.' },
        ],
    },

    {
        id: 'pre-registration-seminar',
        slug: 'pre-registration-seminar',
        title: 'Pre-Registration Seminar (PRS) & Association Capability Building',
        tagline: 'Importante nga lakang padulong sa hapsay nga pagparehistro ug pagpalambo sa panginabuhian.',
        category: 'Cooperative Formation',
        categoryKey: 'formation',
        badge: 'Enterprise Formation',
        accent: 'indigo',
        accentColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900',
        date: 'August 5, 2026',
        periodLabel: 'Formation Seminar',
        venue: 'Citihomes Subdivision, Barangay Malanang, Opol',
        leadAgency: 'MCDO Opol in collaboration with CDA (Ms. Malou Aventurado)',
        featured: false,

        // Official English Executive Narrative
        executiveSummary:
            'Taking decisive action to empower emerging local livelihood organizations, the Municipal Cooperative Development Office (MCDO) successfully conducted a Pre-Registration Seminar (PRS) on August 5, 2026, at Citihomes, Malanang, Opol. Dedicated to the Tupad Pangkabuhayan Beneficiaries Association, the seminar provided foundational training on cooperative values, legal bylaws drafting, capital mobilization, and organizational structure. The seminar was facilitated with high-level technical expertise from the Cooperative Development Authority (CDA), through Cooperative Development Specialist Ms. Malou Aventurado, setting a clear institutional pathway toward formal registration and economic sustainability.',

        // Authentic Local Caption (Cebuano / Bisaya)
        localCaption: {
            headline: 'Pre-Registration Seminar alang sa Tupad Pangkabuhayan Beneficiaries Association',
            body: 'Malampuson nga nahuman ang Pre-Registration Seminar sa Tupad Pangkabuhayan Beneficiaries Association niadtong Agosto 5, 2026 sa Citihomes, Malanang, Opol.\n\nNagpasalamat kami sa tanang mga miyembro ug partisipante nga aktibong mitambong ug mipakita sa ilang kooperasyon aron mahimong organisado ug lig-on ang asosasyon. Ang maong seminar usa ka importante nga lakang padulong sa hapsay nga pagparehistro ug sa pagpalambo sa panginabuhian sa matag benepisyaryo.\n\nDako usab ang among pasalamat sa CDA, ilabina kang Ms. Malou Aventurado, alang sa iyang panahon, suporta, ug pagpaambit sa iyang kahibalo nga nakatabang sa kalampusan sa maong seminar.\n\nPadayon kita sa panaghiusa ug pagtinabangay alang sa mas maayong kaugmaon sa atong komunidad.',
            quote: 'Usa ka importante nga lakang padulong sa hapsay nga pagparehistro ug sa pagpalambo sa panginabuhian sa matag benepisyaryo. 💙❤️❤️',
        },

        highlights: [
            'Guided the Tupad Pangkabuhayan Beneficiaries Association through formal cooperative requirements',
            'Conducted in close partnership with the Cooperative Development Authority (CDA)',
            'Special acknowledgement to Ms. Malou Aventurado (CDA) for technical mentorship and guidance',
            'Equipped 100% of participants with basic governance and financial knowledge prior to registration',
        ],

        stats: [
            { label: 'Seminar Date', value: 'August 5, 2026' },
            { label: 'Beneficiary Group', value: 'Tupad Pangkabuhayan' },
            { label: 'CDA Partner', value: 'Ms. Malou Aventurado' },
            { label: 'Documentation', value: '3 Photos' },
        ],

        coverImage: prs5,
        gallery: [
            { src: prs5, title: 'PRS Orientation Session at Citihomes', caption: 'Beneficiaries actively listening to the orientation on cooperative principles and legal requisites.' },
            { src: prs6, title: 'Interactive Mentorship with CDA Specialist', caption: 'Ms. Malou Aventurado of the CDA sharing insights on sustainable cooperative management.' },
            { src: prs7, title: 'Solidarity & Future Planning Assembly', caption: 'Association members committing to collective cooperation and official registration roadmap.' },
        ],
    },
];

export const ACHIEVEMENTS_METRICS = {
    totalMilestones: 5,
    totalPhotos: 26,
    barangaysCovered: 14,
    cooperativesEngaged: '15+ Partners',
    complianceRating: '100% Tracked',
};
