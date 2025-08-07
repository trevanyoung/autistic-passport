import * as pulumi from "@pulumi/pulumi";

const cfg = new pulumi.Config("app");

/**
 * Pulumi config (set with: pulumi config set app:key value)
 */
export const projectName     = pulumi.getProject();
export const stackName       = pulumi.getStack();

export const bucketName      = cfg.get("bucketName") || `${projectName}-${stackName}-site`;
export const priceClass      = cfg.get("priceClass") || "PriceClass_100"; // 100, 200, All
export const domainName      = cfg.get("domainName");        // e.g. autisticpassport.com (optional)
export const altNames        = cfg.getObject<string[]>("altNames") || []; // e.g. ["www.autisticpassport.com"]

// For GitHub OIDC / IAM (optional now; useful later)
export const repoOwner       = cfg.get("repoOwner") || "trevanyoung";
export const repoName        = cfg.get("repoName")  || "autistic-passport";
export const deployBranch    = cfg.get("deployBranch") || "main";

export const defaultTags: Record<string, string> = {
  Project: projectName,
  Stack: stackName,
};
