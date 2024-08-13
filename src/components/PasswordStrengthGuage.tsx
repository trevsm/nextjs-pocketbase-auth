// PasswordStrengthGauge.tsx
"use client";

import { Box, LinearProgress, Typography } from "@mui/material";

const complexity = (password: string) => {
  let score = 0;
  const criteria = {
    minLength8: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  Object.values(criteria).forEach((met) => {
    if (met) score += 1;
  });

  return { score, criteria };
};

const colorAndStrength = (score: number) => {
  if (score === 0) {
    return {
      color: "error",
      strength: "Very Weak",
    };
  }

  if (score <= 2) {
    return {
      color: "error",
      strength: "Weak",
    };
  } else if (score <= 4) {
    return {
      color: "warning",
      strength: "Medium",
    };
  } else {
    return {
      color: "success",
      strength: "Strong",
    };
  }
};

const getMissingCriteria = (criteria: Record<string, boolean>) => {
  const messages = [];

  if (!criteria.minLength8) {
    messages.push("at least 8 characters");
  }
  if (!criteria.lowercase) {
    messages.push("a lowercase letter");
  }
  if (!criteria.uppercase) {
    messages.push("an uppercase letter");
  }
  if (!criteria.number) {
    messages.push("a number");
  }
  if (!criteria.specialChar) {
    messages.push("a special character");
  }

  return messages;
};

type PasswordStrengthGaugeProps = {
  password: string;
};

export default function PasswordStrengthGauge({
  password,
}: PasswordStrengthGaugeProps) {
  const { score, criteria } = complexity(password);
  const cs = colorAndStrength(score);
  const missingCriteria = getMissingCriteria(criteria);

  if (password.length === 0) {
    return null;
  }

  return (
    <Box>
      <LinearProgress
        variant="determinate"
        value={(score / 5) * 100}
        color={cs.color as any}
        sx={{
          borderRadius: 1,
          opacity: 0.4,
          my: 1,
        }}
      />
      <Typography
        variant="body1"
        align="center"
        sx={{
          textAlign: "right",
          fontSize: ".9rem",
          color: "grey",
        }}
      >
        {cs.strength}
      </Typography>
      {missingCriteria.length > 0 && (
        <Typography
          variant="body2"
          align="center"
          sx={{
            fontSize: ".8rem",
            color: "grey",
            mt: 1,
          }}
        >
          Password must contain:{" "}
          {missingCriteria.length > 1
            ? missingCriteria.slice(0, -1).join(", ") +
              ", and " +
              missingCriteria[missingCriteria.length - 1]
            : missingCriteria[0]}
        </Typography>
      )}
    </Box>
  );
}
