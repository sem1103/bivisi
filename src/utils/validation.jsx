export const isPasswordValid = (password) => {
  if (password.length < 8) {
    return false;
  }

  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  return (
    uppercaseRegex.test(password) &&
    numberRegex.test(password) &&
    specialCharacterRegex.test(password)
  );
};

export const capitalizeFirstLetter = (string) => {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
};


