<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="page-title">Form Submissions</h2>
        <p class="page-subtitle">Manage contact form submissions from your website.</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex space-x-2">
          <button
            @click="exportToExcel"
            class="btn-secondary flex items-center gap-2"
          >
            <FileSpreadsheetIcon class="w-4 h-4" />
            Export Excel
          </button>
          <button
            @click="exportToPDF"
            class="btn-secondary flex items-center gap-2"
          >
            <FileTextIcon class="w-4 h-4" />
            Export PDF
          </button>
        </div>
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
          <input
            v-model="searchTerm"
            placeholder="Search submissions..."
            class="pl-10 w-64 input-field"
          />
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card">
        <div class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-600">New</p>
              <p class="text-2xl font-bold text-red-600">{{ adminStore.newSubmissionsCount }}</p>
            </div>
            <MailIcon class="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>
      <div class="card">
        <div class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-600">Read</p>
              <p class="text-2xl font-bold text-yellow-600">{{ adminStore.readSubmissionsCount }}</p>
            </div>
            <MailIcon class="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>
      <div class="card">
        <div class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-600">Replied</p>
              <p class="text-2xl font-bold text-green-600">{{ adminStore.repliedSubmissionsCount }}</p>
            </div>
            <MailIcon class="w-8 h-8 text-green-600" />
          </div>
        </div>
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
              <th class="text-left p-4 text-green-700 font-medium">Status</th>
              <th class="text-left p-4 text-green-700 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="submission in filteredSubmissions"
              :key="submission.id"
              class="hover:bg-green-50 border-b border-green-100"
            >
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
              <td class="p-4 text-green-700">{{ submission.date }}</td>
              <td class="p-4">
                <select
                  v-model="submission.status"
                  @change="adminStore.updateSubmissionStatus(submission.id, submission.status)"
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium border',
                    getStatusColor(submission.status)
                  ]"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </td>
              <td class="p-4">
                <button
                  @click="adminStore.deleteSubmission(submission.id)"
                  class="border border-red-300 text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                >
                  <Trash2Icon class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredSubmissions.length === 0" class="text-center py-8 text-green-500">
          No submissions found matching your search.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { SearchIcon, MailIcon, PhoneIcon, Trash2Icon, FileSpreadsheetIcon, FileTextIcon } from 'lucide-vue-next'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const adminStore = useAdminStore()

const searchTerm = ref('')

const filteredSubmissions = computed(() => {
  return adminStore.submissions.filter(submission =>
    submission.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    submission.subject.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    submission.message.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const getStatusColor = (status) => {
  switch (status) {
    case 'new':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'read':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'replied':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const exportToExcel = () => {
  const data = filteredSubmissions.value.map(submission => ({
    Name: submission.name,
    Email: submission.email,
    Phone: submission.phone,
    Subject: submission.subject,
    Message: submission.message,
    Date: submission.date,
    Status: submission.status
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Form Submissions')
  
  // Auto-size columns
  const colWidths = []
  const headers = Object.keys(data[0] || {})
  headers.forEach((header, i) => {
    const maxLength = Math.max(
      header.length,
      ...data.map(row => String(row[header] || '').length)
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
    const clonedTable = table.cloneNode(true)
    const actionHeaders = clonedTable.querySelectorAll('th:last-child, td:last-child')
    actionHeaders.forEach(cell => cell.remove())
    
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
