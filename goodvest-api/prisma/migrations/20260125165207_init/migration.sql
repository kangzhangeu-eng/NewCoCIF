-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "passwordHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SimulationState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "projectGoal" TEXT NOT NULL,
    "proStatus" TEXT NOT NULL,
    "incomeRange" TEXT NOT NULL,
    "investmentHorizon" TEXT NOT NULL,
    "initialAmount" DECIMAL NOT NULL,
    "monthlyAmount" DECIMAL NOT NULL,
    CONSTRAINT "SimulationState_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FinancialSituation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "childrenCount" INTEGER NOT NULL,
    "wealthFinancial" DECIMAL NOT NULL,
    "wealthRealEstate" DECIMAL NOT NULL,
    "housingStatus" TEXT NOT NULL,
    "hasLoans" BOOLEAN NOT NULL,
    "loanMonthlyPayment" DECIMAL,
    "loanRemainingDuration" TEXT,
    CONSTRAINT "FinancialSituation_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiskProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "marketDropReaction" TEXT NOT NULL,
    "experience" BOOLEAN NOT NULL,
    CONSTRAINT "RiskProfile_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KnowledgeAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "riskProfileId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    CONSTRAINT "KnowledgeAnswer_riskProfileId_fkey" FOREIGN KEY ("riskProfileId") REFERENCES "RiskProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PortfolioConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "selectedTheme" TEXT NOT NULL,
    CONSTRAINT "PortfolioConfig_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SatelliteProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioConfigId" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "suitabilityTestPassed" BOOLEAN NOT NULL,
    CONSTRAINT "SatelliteProduct_portfolioConfigId_fkey" FOREIGN KEY ("portfolioConfigId") REFERENCES "PortfolioConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AllocationLine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioConfigId" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "label" TEXT,
    "weightPercent" DECIMAL NOT NULL,
    "diciUrl" TEXT,
    CONSTRAINT "AllocationLine_portfolioConfigId_fkey" FOREIGN KEY ("portfolioConfigId") REFERENCES "PortfolioConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ComplianceData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "isFiscalResidentFrance" BOOLEAN NOT NULL,
    "isUSPerson" BOOLEAN NOT NULL,
    "tin" TEXT,
    "originOfFunds" TEXT NOT NULL,
    "estimatedWealth" DECIMAL,
    "professionalCategory" TEXT NOT NULL,
    "nafCode" TEXT,
    "siret" TEXT,
    "isPPE" BOOLEAN NOT NULL,
    "ppeFunction" TEXT,
    "beneficiaryClause" TEXT NOT NULL,
    CONSTRAINT "ComplianceData_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CivilIdentity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthName" TEXT,
    "nationality" TEXT,
    "phone" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    CONSTRAINT "CivilIdentity_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LegalConsent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "hasReadDocuments" BOOLEAN NOT NULL,
    "acceptedAt" DATETIME,
    "documentsVersion" TEXT NOT NULL,
    CONSTRAINT "LegalConsent_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationState_subscriptionId_key" ON "SimulationState"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialSituation_subscriptionId_key" ON "FinancialSituation"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskProfile_subscriptionId_key" ON "RiskProfile"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioConfig_subscriptionId_key" ON "PortfolioConfig"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "ComplianceData_subscriptionId_key" ON "ComplianceData"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "CivilIdentity_subscriptionId_key" ON "CivilIdentity"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "LegalConsent_subscriptionId_key" ON "LegalConsent"("subscriptionId");
