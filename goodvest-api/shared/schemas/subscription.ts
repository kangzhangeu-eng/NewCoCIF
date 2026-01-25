import { z } from "zod";

const moneySchema = z.coerce.number().nonnegative();

export const createUserSchema = z.object({
  email: z.string().email(),
  birthDate: z.coerce.date(),
  password: z.string().min(8),
});

export const simulationSchema = z.object({
  productType: z.enum(["av", "per", "av_child"]),
  projectGoal: z.enum(["yield", "real_estate", "retirement", "capital"]),
  proStatus: z.enum(["employee", "self_employed", "retired", "student"]),
  incomeRange: z.enum([
    "under_30k",
    "range_30k_50k",
    "range_50k_100k",
    "over_100k",
  ]),
  investmentHorizon: z.enum(["short", "medium", "long"]),
  initialAmount: moneySchema,
  monthlyAmount: moneySchema,
});

export const financialSituationSchema = z
  .object({
    maritalStatus: z.enum(["single", "married", "pacs", "divorced"]),
    childrenCount: z.number().int().min(0),
    wealthFinancial: moneySchema,
    wealthRealEstate: moneySchema,
    housingStatus: z.enum(["owner", "tenant", "free"]),
    hasLoans: z.boolean(),
    loanMonthlyPayment: moneySchema.optional(),
    loanRemainingDuration: z.enum(["under_10", "over_10"]).optional(),
  })
  .refine((data) => {
    if (data.hasLoans) {
      return Boolean(data.loanMonthlyPayment) && Boolean(data.loanRemainingDuration);
    }
    return true;
  }, "Loan fields required when hasLoans is true");

export const riskProfileSchema = z.object({
  marketDropReaction: z.enum(["hold", "buy", "sell"]),
  experience: z.boolean(),
  knowledgeAnswers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        isCorrect: z.boolean(),
      })
    )
    .min(1),
});

export const portfolioConfigSchema = z.object({
  selectedTheme: z.string().min(1),
  satelliteProducts: z.array(
    z.object({
      productCode: z.string().min(1),
      amount: moneySchema,
      suitabilityTestPassed: z.boolean(),
    })
  ),
  allocations: z.array(
    z.object({
      fundName: z.string().min(1),
      assetType: z.enum(["stocks", "bonds", "etf"]),
      label: z.string().optional(),
      weightPercent: moneySchema,
      diciUrl: z.string().url().optional(),
    })
  ),
});

export const complianceSchema = z
  .object({
    isFiscalResidentFrance: z.boolean(),
    isUSPerson: z.boolean(),
    tin: z.string().optional(),
    originOfFunds: z.array(z.string().min(1)).min(1),
    estimatedWealth: moneySchema.optional(),
    professionalCategory: z.string().min(1),
    nafCode: z.string().optional(),
    siret: z.string().optional(),
    isPPE: z.boolean(),
    ppeFunction: z.string().optional(),
    beneficiaryClause: z.enum(["standard", "children", "custom"]),
  })
  .refine((data) => !data.isUSPerson || Boolean(data.tin), {
    message: "TIN required for US Person",
    path: ["tin"],
  });

export const civilIdentitySchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthName: z.string().optional(),
  nationality: z.string().optional(),
  phone: z.string().min(4),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  postalCode: z.string().min(2),
  city: z.string().min(1),
  country: z.string().min(1),
});

export const legalConsentSchema = z.object({
  hasReadDocuments: z.boolean(),
  acceptedAt: z.coerce.date().optional(),
  documentsVersion: z.string().min(1),
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;
export type SimulationPayload = z.infer<typeof simulationSchema>;
export type FinancialSituationPayload = z.infer<typeof financialSituationSchema>;
export type RiskProfilePayload = z.infer<typeof riskProfileSchema>;
export type PortfolioConfigPayload = z.infer<typeof portfolioConfigSchema>;
export type CompliancePayload = z.infer<typeof complianceSchema>;
export type CivilIdentityPayload = z.infer<typeof civilIdentitySchema>;
export type LegalConsentPayload = z.infer<typeof legalConsentSchema>;
