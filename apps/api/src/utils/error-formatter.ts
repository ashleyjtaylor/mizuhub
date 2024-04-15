import { ZodError, ZodIssue, ZodIssueCode } from 'zod'

interface ErrorItem {
  path: string | number | undefined;
  code: ZodIssue['code'];
  message: string;
}

export default (error: ZodError) => {
  const items: ErrorItem[] = []

  error.issues.forEach(issue => {
    const code = issue.code
    const path = issue.path[0]

    switch (code) {
      case ZodIssueCode.invalid_type:
        items.push({ path, code, message: `Invalid ${path}` })
        break
      case ZodIssueCode.too_big:
        items.push({ path, code, message: `${path} must not exceed ${issue.maximum} characters` })
        break
      default:
    }
  })

  return items
}
