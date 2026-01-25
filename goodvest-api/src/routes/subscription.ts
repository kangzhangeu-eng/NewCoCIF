import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma.js";
import {
  complianceSchema,
  createUserSchema,
  financialSituationSchema,
  portfolioConfigSchema,
  type PortfolioConfigPayload,
  riskProfileSchema,
  type RiskProfilePayload,
  simulationSchema,
  civilIdentitySchema,
  legalConsentSchema,
} from "../schemas/subscription.js";

export const subscriptionRouter = Router();

subscriptionRouter.post("/", async (req: Request, res: Response) => {
  const payload = createUserSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      email: payload.email,
      birthDate: payload.birthDate,
      passwordHash,
      subscription: { create: {} },
    },
    include: { subscription: true },
  });

  res.status(201).json({ user });
});

subscriptionRouter.get("/:subscriptionId", async (req: Request, res: Response) => {
  const subscriptionId = req.params.subscriptionId;

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      user: true,
      simulation: true,
      financialSituation: true,
      riskProfile: { include: { knowledgeAnswers: true } },
      portfolioConfig: { include: { satelliteProducts: true, allocations: true } },
      complianceData: true,
      legalConsent: true,
      civilIdentity: true,
    },
  });

  if (!subscription) {
    res.status(404).json({ message: "Subscription not found" });
    return;
  }

  const complianceData = subscription.complianceData
    ? {
        ...subscription.complianceData,
        originOfFunds: (() => {
          try {
            return JSON.parse(subscription.complianceData.originOfFunds);
          } catch {
            return [];
          }
        })(),
      }
    : null;

  res.status(200).json({
    subscription: {
      ...subscription,
      complianceData,
    },
  });
});

subscriptionRouter.put("/:subscriptionId/simulation", async (req: Request, res: Response) => {
  const payload = simulationSchema.parse(req.body);
  const subscriptionId = req.params.subscriptionId;

  const simulation = await prisma.simulationState.upsert({
    where: { subscriptionId },
    update: payload,
    create: { ...payload, subscriptionId },
  });

  res.status(200).json({ simulation });
});

subscriptionRouter.put("/:subscriptionId/financial", async (req: Request, res: Response) => {
  const payload = financialSituationSchema.parse(req.body);
  const subscriptionId = req.params.subscriptionId;

  const financialSituation = await prisma.financialSituation.upsert({
    where: { subscriptionId },
    update: payload,
    create: { ...payload, subscriptionId },
  });

  res.status(200).json({ financialSituation });
});

subscriptionRouter.put("/:subscriptionId/risk", async (req: Request, res: Response) => {
  const payload = riskProfileSchema.parse(req.body) as RiskProfilePayload;
  const subscriptionId = req.params.subscriptionId;

  const riskProfile = await prisma.riskProfile.upsert({
    where: { subscriptionId },
    update: {
      marketDropReaction: payload.marketDropReaction,
      experience: payload.experience,
      knowledgeAnswers: {
        deleteMany: {},
        createMany: {
          data: payload.knowledgeAnswers.map((answer: RiskProfilePayload["knowledgeAnswers"][number]) => ({
            questionId: answer.questionId,
            isCorrect: answer.isCorrect,
          })),
        },
      },
    },
    create: {
      subscriptionId,
      marketDropReaction: payload.marketDropReaction,
      experience: payload.experience,
      knowledgeAnswers: {
        createMany: {
          data: payload.knowledgeAnswers.map((answer: RiskProfilePayload["knowledgeAnswers"][number]) => ({
            questionId: answer.questionId,
            isCorrect: answer.isCorrect,
          })),
        },
      },
    },
  });

  res.status(200).json({ riskProfile });
});

subscriptionRouter.put("/:subscriptionId/portfolio", async (req: Request, res: Response) => {
  const payload = portfolioConfigSchema.parse(req.body) as PortfolioConfigPayload;
  const subscriptionId = req.params.subscriptionId;

  const portfolioConfig = await prisma.portfolioConfig.upsert({
    where: { subscriptionId },
    update: {
      selectedTheme: payload.selectedTheme,
      satelliteProducts: {
        deleteMany: {},
        createMany: {
          data: payload.satelliteProducts.map((product: PortfolioConfigPayload["satelliteProducts"][number]) => ({
            productCode: product.productCode,
            amount: product.amount,
            suitabilityTestPassed: product.suitabilityTestPassed,
          })),
        },
      },
      allocations: {
        deleteMany: {},
        createMany: {
          data: payload.allocations.map((allocation: PortfolioConfigPayload["allocations"][number]) => ({
            fundName: allocation.fundName,
            assetType: allocation.assetType,
            label: allocation.label,
            weightPercent: allocation.weightPercent,
            diciUrl: allocation.diciUrl,
          })),
        },
      },
    },
    create: {
      subscriptionId,
      selectedTheme: payload.selectedTheme,
      satelliteProducts: {
        createMany: {
          data: payload.satelliteProducts.map((product: PortfolioConfigPayload["satelliteProducts"][number]) => ({
            productCode: product.productCode,
            amount: product.amount,
            suitabilityTestPassed: product.suitabilityTestPassed,
          })),
        },
      },
      allocations: {
        createMany: {
          data: payload.allocations.map((allocation: PortfolioConfigPayload["allocations"][number]) => ({
            fundName: allocation.fundName,
            assetType: allocation.assetType,
            label: allocation.label,
            weightPercent: allocation.weightPercent,
            diciUrl: allocation.diciUrl,
          })),
        },
      },
    },
  });

  res.status(200).json({ portfolioConfig });
});

subscriptionRouter.put("/:subscriptionId/compliance", async (req: Request, res: Response) => {
  const payload = complianceSchema.parse(req.body);
  const subscriptionId = req.params.subscriptionId;
  const compliancePayload = {
    ...payload,
    originOfFunds: JSON.stringify(payload.originOfFunds),
  };

  const complianceData = await prisma.complianceData.upsert({
    where: { subscriptionId },
    update: compliancePayload,
    create: { ...compliancePayload, subscriptionId },
  });

  res.status(200).json({ complianceData });
});

subscriptionRouter.put("/:subscriptionId/identity", async (req: Request, res: Response) => {
  const payload = civilIdentitySchema.parse(req.body);
  const subscriptionId = req.params.subscriptionId;

  const civilIdentity = await prisma.civilIdentity.upsert({
    where: { subscriptionId },
    update: payload,
    create: { ...payload, subscriptionId },
  });

  res.status(200).json({ civilIdentity });
});

subscriptionRouter.put("/:subscriptionId/legal", async (req: Request, res: Response) => {
  const payload = legalConsentSchema.parse(req.body);
  const subscriptionId = req.params.subscriptionId;

  const legalConsent = await prisma.legalConsent.upsert({
    where: { subscriptionId },
    update: payload,
    create: { ...payload, subscriptionId },
  });

  res.status(200).json({ legalConsent });
});
