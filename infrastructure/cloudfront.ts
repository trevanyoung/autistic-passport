// infrastructure/cloudfront.ts
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { siteBucket, bucketRegionalDomainName } from "./s3";

/** Custom domain(s) */
const domainName = "autisticpassport.com";
const altNames = ["www.autisticpassport.com"]; // SANs

/** 🔒 Use existing ACM cert (us-east-1). Pulumi will NOT create/modify certs. */
const ACM_CERT_ARN =
  "arn:aws:acm:us-east-1:695862630466:certificate/cb442fff-7487-4ea0-91cb-33da2481a312";

/** Origin Access Control so CF can read from *private* S3 */
export const oac = new aws.cloudfront.OriginAccessControl("oac", {
  name: pulumi.interpolate`${siteBucket.bucket}-oac`,
  originAccessControlOriginType: "s3",
  signingBehavior: "always",
  signingProtocol: "sigv4",
});

/** CloudFront distribution */
export const distribution = new aws.cloudfront.Distribution("cdn", {
  enabled: true,
  isIpv6Enabled: true,
  defaultRootObject: "index.html",

  // Use your custom domains
  aliases: [domainName, ...altNames],

  origins: [
    {
      originId: siteBucket.arn,
      domainName: bucketRegionalDomainName, // e.g., bucket.s3.us-east-1.amazonaws.com
      originAccessControlId: oac.id,
      s3OriginConfig: { originAccessIdentity: "" }, // empty when using OAC
    },
  ],

  defaultCacheBehavior: {
    targetOriginId: siteBucket.arn,
    viewerProtocolPolicy: "redirect-to-https",
    allowedMethods: ["GET", "HEAD", "OPTIONS"],
    cachedMethods: ["GET", "HEAD", "OPTIONS"],
    compress: true,
    forwardedValues: { queryString: false, cookies: { forward: "none" } },
  },

  // SPA-friendly: send 403/404 to index.html
  customErrorResponses: [
    { errorCode: 403, responseCode: 200, responsePagePath: "/index.html" },
    { errorCode: 404, responseCode: 200, responsePagePath: "/index.html" },
  ],

  restrictions: { geoRestriction: { restrictionType: "none" } },
  priceClass: "PriceClass_100",

  // 🔒 Attach your existing ACM cert (no DNS changes)
  viewerCertificate: {
    acmCertificateArn: ACM_CERT_ARN,
    sslSupportMethod: "sni-only",
    minimumProtocolVersion: "TLSv1.2_2021",
  },

  // Optional: keep this so CF waits for full deploy before Pulumi finishes
  waitForDeployment: true,
});

/** Allow *this* CloudFront distribution to read objects via OAC */
new aws.s3.BucketPolicy("oacReadPolicy", {
  bucket: siteBucket.bucket,
  policy: pulumi.all([siteBucket.arn, distribution.arn]).apply(([bucketArn, distArn]) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "AllowCloudFrontRead",
          Effect: "Allow",
          Principal: { Service: "cloudfront.amazonaws.com" },
          Action: ["s3:GetObject"],
          Resource: [`${bucketArn}/*`],
          Condition: { StringEquals: { "AWS:SourceArn": distArn } },
        },
      ],
    })
  ),
});

export const cloudFrontDomain = distribution.domainName; // e.g., d123.cloudfront.net
export const cloudFrontId = distribution.id;
