export function useFormValidation() {
  const required = (v: string | null | undefined) => !!v || 'Field is required';
  const email = (v: string | null | undefined) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email must be valid';
  return {
    required,
    email
  };
}
