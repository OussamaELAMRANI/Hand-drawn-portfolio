let timer: ReturnType<typeof setTimeout> | undefined

export function useAdminToast() {
  const message = useState<string>('admin-toast', () => '')

  function toast(text: string) {
    message.value = text
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      message.value = ''
    }, 2200)
  }

  return { message, toast }
}
