export const useFileUpload = () => {
  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"))
        return
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        reject(new Error("Invalid file type. Please upload an image file."))
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        reject(new Error("File size too large. Maximum size is 5MB."))
        return
      }

      const reader = new FileReader()

      reader.onload = (e) => {
        resolve(e.target.result)
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      reader.readAsDataURL(file)
    })
  }

  const selectFile = () => {
    return new Promise((resolve) => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"

      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          resolve(file)
        }
      }

      input.click()
    })
  }

  return {
    uploadFile,
    selectFile,
  }
}
