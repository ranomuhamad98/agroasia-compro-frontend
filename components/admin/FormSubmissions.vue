<template>
  <div class="space-y-6">
    <div class="flex items-center space-x-4 justify-end">
      <div class="flex space-x-2">
        <button @click="exportToExcel" class="btn-primary bg-green-100 text-green-800 flex items-center gap-2">
          <FileSpreadsheetIcon class="w-4 h-4" />
          Export Excel
        </button>
        <button @click="exportToPDF" class="btn-primary bg-green-100 text-green-800 flex items-center gap-2">
          <FileTextIcon class="w-4 h-4" />
          Export PDF
        </button>
      </div>
    </div>

    <!-- Submissions Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-green-800 font-semibold">All Submissions</h3>
      </div>
      <div class="overflow-x-auto">
        <table id="submissions-table" class="w-full">
          <thead class="bg-green-50">
            <tr>
              <th class="text-left p-4 text-green-700 font-medium">Name</th>
              <th class="text-left p-4 text-green-700 font-medium">Email</th>
              <th class="text-left p-4 text-green-700 font-medium">Phone</th>
              <th class="text-left p-4 text-green-700 font-medium">Subject</th>
              <th class="text-left p-4 text-green-700 font-medium">Message</th>
              <th class="text-left p-4 text-green-700 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="submission in props.contactUs" :key="submission.id"
              class="hover:bg-green-50 border-b border-green-100">
              <td class="p-4 font-medium text-green-800">{{ submission.name }}</td>
              <td class="p-4 text-green-700">{{ submission.email }}</td>
              <td class="p-4">
                <div class="flex items-center text-green-700">
                  <PhoneIcon class="w-4 h-4 mr-2 text-green-400" />
                  {{ submission.phone }}
                </div>
              </td>
              <td class="p-4 text-green-700">{{ submission.subject }}</td>
              <td class="p-4 max-w-xs truncate text-green-600">{{ submission.message }}</td>
              <td class="p-4 text-green-700">{{ submission.created_at ? formatDate(submission.created_at) : '' }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="props.contactUs.length === 0" class="text-center py-8 text-green-500">
          No submissions found matching your search.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { PhoneIcon, FileSpreadsheetIcon, FileTextIcon } from 'lucide-vue-next'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { ContactUs } from '@/types/contact-us-api-type'

const props = defineProps({
  contactUs: {
    type: Array as PropType<ContactUs[]>,
    required: true,
  },
})

const formatDate = (date: string) => {
  return new Date(date).toISOString().split('T')[0]
}

const exportToExcel = () => {
  const data = props.contactUs.map(submission => ({
    Name: submission.name,
    Email: submission.email,
    Phone: submission.phone,
    Subject: submission.subject,
    Message: submission.message,
    Date: submission.created_at ? formatDate(submission.created_at) : '',
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Form Submissions')

  // Auto-size columns
  const colWidths: any[] = []
  const headers = Object.keys(data[0] || {})
  headers.forEach((header, i) => {
    const maxLength = Math.max(
      header.length,
      ...data.map(row => String((row as any)[header] || '').length)
    )
    colWidths[i] = { wch: Math.min(maxLength + 2, 50) }
  })
  ws['!cols'] = colWidths

  const fileName = `form-submissions-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fileName)
}

const exportToPDF = async () => {
  const table = document.getElementById('submissions-table')
  if (!table) return

  try {
    // Create a temporary container for the table
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.background = 'white'
    tempContainer.style.padding = '20px'

    // Clone the table and remove action column
    const clonedTable = table.cloneNode(true) as HTMLElement
    const actionHeaders = clonedTable.querySelectorAll('th:last-child, td:last-child')
    actionHeaders.forEach((cell: Element) => cell.remove())

    // Add title
    const title = document.createElement('h2')
    title.textContent = 'Form Submissions Report'
    title.style.textAlign = 'center'
    title.style.marginBottom = '20px'
    title.style.color = '#166534'

    const date = document.createElement('p')
    date.textContent = `Generated on: ${new Date().toLocaleDateString()}`
    date.style.textAlign = 'center'
    date.style.marginBottom = '20px'
    date.style.color = '#666'

    tempContainer.appendChild(title)
    tempContainer.appendChild(date)
    tempContainer.appendChild(clonedTable)
    document.body.appendChild(tempContainer)

    // Capture the table as canvas
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })

    // Remove temporary container
    document.body.removeChild(tempContainer)

    // Create PDF
    const pdf = new jsPDF('l', 'mm', 'a4') // landscape orientation
    const imgWidth = 280
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight)

    const fileName = `form-submissions-${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try again.')
  }
}
</script>
