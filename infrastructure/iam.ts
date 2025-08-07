import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { bucketName, deployBranch, repoName, repoOwner } from "./config";

/**
 * GitHub OIDC Provider (one per account; creating again is idempotent in Pulumi)
 */
export const githubOidc = new aws.iam.OpenIdConnectProvider("githubOidc", {
  url: "https://token.actions.githubusercontent.com",
  clientIdLists: ["sts.amazonaws.com"],
  thumbprintLists: ["6938fd4d98bab03faadb97b34396831e3780aea1"],
});

/**
 * Trust policy: only allow this repo + branch to assume role.
 */
const assumeRole = aws.iam.getPolicyDocumentOutput({
  statements: [{
    effect: "Allow",
    principals: [{ type: "Federated", identifiers: [githubOidc.arn] }],
    actions: ["sts:AssumeRoleWithWebIdentity"],
    conditions: [
      { test: "StringEquals", variable: "token.actions.githubusercontent.com:aud", values: ["sts.amazonaws.com"] },
      { test: "StringLike", variable: "token.actions.githubusercontent.com:sub", values: [`repo:${repoOwner}/${repoName}:ref:refs/heads/${deployBranch}`] },
    ],
  }],
});

export const deployRole = new aws.iam.Role("spaDeployRole", {
  assumeRolePolicy: assumeRole.apply(p => p.json),
  description: "Role for GitHub Actions to deploy SPA to S3 and invalidate CloudFront",
});

/**
 * Least-privilege policy to sync S3 and create CF invalidations.
 * (CloudFront invalidation doesn’t support resource ARNs; so scope is * for that action.)
 */
const policyDoc = aws.iam.getPolicyDocumentOutput({
  statements: [
    {
      effect: "Allow",
      actions: ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket", "s3:GetObject"],
      resources: [
        pulumi.interpolate`arn:aws:s3:::${bucketName}`,
        pulumi.interpolate`arn:aws:s3:::${bucketName}/*`,
      ],
    },
    {
      effect: "Allow",
      actions: ["cloudfront:CreateInvalidation"],
      resources: ["*"],
    },
  ],
});

const deployPolicy = new aws.iam.Policy("spaDeployPolicy", {
  policy: policyDoc.apply(p => p.json),
});

new aws.iam.RolePolicyAttachment("attachSpaDeployPolicy", {
  role: deployRole.name,
  policyArn: deployPolicy.arn,
});

export const deployRoleArn = deployRole.arn;
