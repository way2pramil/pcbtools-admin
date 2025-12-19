// Test GA_PRIVATE_KEY parsing
// Run with: node test-key.js

// Simulating how Coolify might pass the env var
const rawKey = `-----BEGIN PRIVATE KEY-----\\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDGmjMab8bh0kai\\n7XO019HQdKkgFzKqwV6YX1QDu4AX09fan/CfZ+Rw9E14vkNrVOBEfhCLtjfrA+iP\\nr4X+BUF/Xu3klb+ggoGcF+XLtN3XJOV8cSI2chWTSghWr9eLO6IzDuMsY5dI93Bl\\nz58ncqjrSjMyzVWUlG0AktQFK5CykHJiSb7ohTRv07W1nd1yCfYcvdAU92/I+u7o\\nI4Br+VdeLLxQyqcffQ84fT91CXyK7wJ1s+BOSCjCXD/DAsuCMzftzT0zB/S2cUoo\\nMh+Mpcqk9ahQEXiQY6T+iodO/nmVCq0dtH4Yk1CuKuM/lcGN0kKXltYn4YsGrGWf\\n8eePPEZfAgMBAAECggEAUUz5o5Zjf7lRckwrZDo/aYsAWyMz+iP7wfuwTHDa4KY3\\nxIdZ/R+OLFFOT6HvvoX54wAKbO801+/7Karses8S/33QfBVzY1VZkplT2H7bm8G+\\nciFsJIayX1/cpwQIBDbu0OEEzXydh2DH8d27JO5yyRNQfzkAkjjqoGP7CHzLmNUA\\naKBDruZVpdRz9DY9guPz4CUsE92pOxzIZNwDRqM83e0g+ra4Asm8Jgvt77hg9aaH\\nbUSA93jXWR/kp2mhNSO2j7MNOUh6FFpPqeBZ2I5C4LRB1SknQ5D1LSjnvuhlLFm/\\nFPllzrboRuOKe+M9IQ9t/iQayomD56klj5Gn0YNi6QKBgQD6QzgxMujffFoSdg4F\\n/lY+Kod2jDyCL7k0Wt3jromfkirucLvMxpIe3bfx5MXKglVKcH+Wli20wTwboqVI\\nM2yLH/LWT20ZdqzEtnKDMmg1CBknl9oT0fJXiDkiAo0/i8J0rn1YR77FZlCBNuym\\nH5umhwUxS+K/epSoBmsx6fFDlwKBgQDLJ8nT1SqL9axzjirzcUOtcuub85NSn3kp\\n1wObu1so04CdXpgDeUNY0s86F2plfc5bZubQQNpWNt1DQSxNnxBhiDui9UeblzUp\\nJYuSIkGPMPVE2nGpvGTJK2SGEpxxKwm8FaYWDlAK7CLe41Rs+qmtXSXmbS4YhsDh\\nsgTJF0HMeQKBgAsV5SxQu/4CTR8aOZ7MWFeinKOErL17jbGjAMcwGQqHd/1d4wO8\\nHAbf/WDqqFRDF7IXb59lAZtLH/V9a+LZ3EoBXUle9U82cYq5JjNnjTQkKrEVSeSs\\n3RZBg35dLJKPB0sR252IeAvYb2J541usdMGYo4M+gEnJDUKwHhl06mn7AoGAbS1Q\\n1bq1Rsoch21bv8Ca8lfULtdT0Q9K+iVHFyY081fWwrvXTeaZPt7r5vg2gZx+jbhb\\nSofPzo1lk4Mu3/gfwYqJIiZW+VLlittWio5GVUGmTf5nHyTTtRjQyQyvblIGxUGN\\nJEVE1tnYU5gwAvEixrxMZe0+3IdumNwmnjsVbWECgYBbwzNzXZE6LbumfD1/yhaG\\nt+oaHSPi6rd8OrIRpV9lbRbNtB+mmme5WlvplXKkib/NrK6iK+HALqA47qOqT3lc\\nOJStZiQp5Em+n32n8tu14lO1osw4g3mSL4iQx7ZM15HyDxISGZt1gKj8rL0y0qa4\\nzJiRzW4QUanUEXqAq8k6tg==\\n-----END PRIVATE KEY-----\\n`;

console.log("=== RAW KEY ===");
console.log("Length:", rawKey.length);
console.log("First 60 chars:", rawKey.substring(0, 60));
console.log("Contains literal backslash-n:", rawKey.includes("\\n"));

console.log("\n=== AFTER REPLACE ===");
const parsed = rawKey.replace(/\\n/g, "\n");
console.log("Length:", parsed.length);
console.log("First 60 chars:", JSON.stringify(parsed.substring(0, 60)));
console.log("Contains real newline:", parsed.includes("\n"));
console.log("Line count:", parsed.split("\n").length);

console.log("\n=== FULL PARSED KEY ===");
console.log(parsed);
