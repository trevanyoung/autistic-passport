import * as aws from "@pulumi/aws";

export const siteBucket = new aws.s3.Bucket("siteBucket", {
  bucket: "autistic-passport-site", // must be globally unique; change if collision
  forceDestroy: false,
});

// Lock it down (all public access blocked)
new aws.s3.BucketPublicAccessBlock("siteBucketPab", {
  bucket: siteBucket.id,
  blockPublicAcls: true,
  ignorePublicAcls: true,
  blockPublicPolicy: true,
  restrictPublicBuckets: true,
});

// Not using website hosting here; CloudFront handles index/error rewrites.

export const bucketName = siteBucket.bucket;
export const bucketRegionalDomainName = siteBucket.bucketRegionalDomainName;


