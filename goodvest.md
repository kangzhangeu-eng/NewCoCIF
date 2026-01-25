Spécification Technique : Parcours de Souscription Newco
Version du document : 1.0 Stack Cible : Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, React Hook Form + Zod, Recharts.

1. User Flow Master (Architecture du Tunnel)
Le parcours est divisé en 3 phases majeures (Stepper Global) contenant des sous-étapes séquentielles.

Phase 1 : Simulation & Profilage (Lead Generation)
L'objectif est de qualifier le prospect et de déterminer son profil de risque (SRI).

Product Selection : Choix de l'enveloppe (Assurance-vie, PER, etc.).

Account Creation : "Soft sign-up" (Email + MDP + Date de naissance) pour sauvegarder la simulation.

Project Goals : Objectif (Immo, Retraite...) + Situation Pro + Revenus.

Investment Param : Horizon de placement + Montant initial/mensuel.

Family & Wealth : Situation maritale + Enfants + Patrimoine (Financier/Immo) + Logement (Proprio/Locataire).

Liabilities (Conditionnel) : Emprunts en cours ? (Si Oui -> Montant + Durée).

Risk Profiling (MIF II) :

Réaction baisse marché (-10%).

Expérience financière (Actions/Obligations ?).

Tests de connaissances (Quiz Bloquant avec Feedback immédiat).

Phase 2 : Recommandation (Conversion)
Affichage de la stratégie d'investissement proposée.

Lead Interceptor : Modale de captation (Nom/Tel) déclenchée à la fin du Quiz.

Dashboard Proposition :

Graphique de projection interactif.

Tableau d'allocation d'actifs (Fonds ESG).

Indicateurs d'impact (Climat/Biodiversité).

Personalization (Satellites) : Ajout de produits structurés/Private Equity via Modale dédiée (Voir Composants Complexes).

Gatekeeper : Validation de l'email requise pour passer à l'étape suivante.

Phase 3 : Souscription (Compliance & KYC)
Collecte des données réglementaires pour la finalisation du contrat.

Legal Consent : Visualisation obligatoire (Scroll/Download) des DICI/CGV + Checkbox.

Civil Identity : État civil complet, Nom de naissance, Adresse.

Fiscality (FATCA/CRS) : Résidence fiscale, US Person (Warning), TIN.

AML (Anti-Money Laundering) : Origine des fonds (Multi-select), Estimation patrimoine global.

Professional Details : Catégorie socio-pro, Code NAF, SIRET (si indépendant).

PPE & Beneficiaries : Déclaration Personne Politiquement Exposée + Clause bénéficiaire (Standard/Spécifique).

2. Dictionnaire de Données (Data Schema)
Structure TypeScript recommandée pour le store global (useNewcoStore).

TypeScript

type UserProfile = {
  email: string;
  birthDate: string; // DD/MM/YYYY
  password?: string; // Hashed/Handled by Auth provider
};

type SimulationState = {
  productType: 'av' | 'per' | 'av_child';
  projectGoal: 'yield' | 'real_estate' | 'retirement' | 'capital';
  proStatus: 'employee' | 'self_employed' | 'retired' | 'student';
  incomeRange: 'under_30k' | '30k_50k' | '50k_100k' | 'over_100k';
  investmentHorizon: 'short' | 'medium' | 'long';
  initialAmount: number;
  monthlyAmount: number;
};

type FinancialSituation = {
  maritalStatus: 'single' | 'married' | 'pacs' | 'divorced';
  childrenCount: number;
  wealth: {
    financial: number;
    realEstate: number;
  };
  housingStatus: 'owner' | 'tenant' | 'free';
  loans: {
    hasLoans: boolean;
    monthlyPayment?: number;
    remainingDuration?: 'under_10' | 'over_10';
  };
};

type RiskProfile = {
  marketDropReaction: 'hold' | 'buy' | 'sell';
  experience: boolean;
  knowledgeQuiz: Record<string, boolean>; // QuestionID -> IsCorrect
};

type PortfolioConfig = {
  selectedTheme: string; // ex: 'eco_transition'
  satelliteProducts: Array<{
    id: string;
    amount: number;
    suitabilityTestPassed: boolean;
  }>;
};

type ComplianceData = {
  isFiscalResidentFrance: boolean;
  isUSPerson: boolean;
  tin?: string;
  originOfFunds: string[]; // ['savings', 'inheritance', ...]
  professionalDetails: {
    category: string;
    nafCode?: string;
    siret?: string;
  };
  ppe: {
    isExposed: boolean;
    function?: string;
  };
  beneficiaryClause: 'standard' | 'children' | 'custom';
};
3. Règles Métier & Logique
Calculs & Projections
Projection Financière : Utiliser la formule des intérêts composés pour tracer 3 courbes :

Scénario Pessimiste : Rendement X% (ex: 2%).

Scénario Cible : Rendement Y% (ex: 6%).

Scénario Optimiste : Rendement Z% (ex: 8%).

Réactivité : Le graphique doit se mettre à jour instantanément (onChange) lors de la modification des inputs "Versement initial" ou "Mensuel" sur la page de recommandation.

Gatekeeping & Blocages
Quiz de Connaissance : L'utilisateur ne peut pas passer à la question suivante tant qu'il n'a pas sélectionné une réponse.

US Person (FATCA) : Si isUSPerson === true, afficher une modale bloquante "Nous ne pouvons pas accepter les contribuables américains" ou demander le TIN obligatoire.

Test d'Adéquation (Satellites) : Pour ajouter un produit structuré (ex: "Altitude 2"), l'utilisateur DOIT réussir un mini-quiz de 3-4 questions. Échec = Ajout impossible (Box rouge d'erreur).

Lecture Légale : Le bouton "Suivant" de l'étape /legal est disabled tant que la checkbox "J'ai lu..." n'est pas cochée.

Logique Conditionnelle (Formulaire Dynamique)
Emprunts : Les champs "Montant" et "Durée" ne sont rendus dans le DOM que si hasLoans === true.

Indépendants : Les champs "SIRET" et "Code NAF" n'apparaissent que si proStatus === 'self_employed'.

4. Design System & UI Patterns
Identité Visuelle (Newco Theme)
Palette :

Background: #FFFCF6 (Crème/Off-white).

Primary Action: #2F7776 (Vert Canard/Forest) -> Hover #1E5251.

Text Main: #11312C (Presque Noir).

Accents/Tags: bg-emerald-100 / text-emerald-800.

Typography : Sans-serif geometric (Inter ou Poppins).

Radius : rounded-xl pour les cartes, rounded-full pour les boutons (Pill shape).

Composants UI Récurrents
SelectableCard : Carte avec icône centrée, label, et état selected (border verte + shadow colorée). Utilisé pour 80% des choix.

MoneyInput : Input text avec suffixe "€" fixe à droite, formatage automatique des milliers (ex: "10 000 €").

InfoBox : Composant d'alerte contextuelle (bg-blue-50 ou bg-green-50) avec icône (i) pour expliquer les termes financiers.

MainStepper : Indicateur de progression 3 étapes en haut de page.

SectionTitle : Pattern "Titre H1 + Sous-titre gris" centré ou aligné gauche.

5. Composants Complexes (Spécifications Détaillées)
A. Le Graphique de Simulation (SimulationChart)
Lib : Recharts.

Type : ComposedChart (Area + Line).

Données : Array d'objets { year: number, deposits: number, projected: number, range: [min, max] }.

Interaction : Tooltip custom au survol affichant les 3 valeurs pour l'année donnée.

Responsive : Doit gérer le resize window proprement.

B. La Modale "Produit Satellite" (SatelliteModal)
C'est une machine à états locale.

State 1 (Info) : Affiche les caractéristiques (Rendement, Risque, Durée). Input montant. Bouton "Ajouter".

State 2 (Quiz) : Remplace le contenu par 3 questions Oui/Non.

State 3 (Result) :

Success : Toast vert, fermeture modale, mise à jour du store global.

Fail : Box rouge "Réponse incorrecte" avec explication. L'utilisateur doit corriger pour passer.

C. Le Sélecteur de Thèmes (AllocationTable)
Structure : Tableau responsive.

Colonnes : Nom Fonds, Type (Action/Obli), Label (Logo ISR/Greenfin), Poids (%).

Feature : Chaque ligne est cliquable pour ouvrir le DICI (PDF) dans un nouvel onglet.

Footer : Barre de progression qui doit atteindre 100% pour valider l'allocation.

D. Formulaire Identité (CivilFormSection)
Layout : Grid system (1 col mobile, 2 cols desktop).

Validation : Zod schema strict.

Email: Regex standard.

Phone: Validation format international (+33...).

Date: Interdiction mineurs (-18 ans).