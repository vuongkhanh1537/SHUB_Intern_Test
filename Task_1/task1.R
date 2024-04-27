library(httr)
library(readxl)
library(writexl)


excel_file_url <- "https://go.microsoft.com/fwlink/?LinkID=521962"
local_filename <- "task1.xlsx"

response <- GET(excel_file_url)

if (response$status_code == 200) {
  writeBin(content(response, "raw"), local_filename)
  cat("File downloaded successfully:", local_filename, "\n")
} else {
  cat("Failed to download file. Status code:", http_status(response)$status, "\n")
}


excel_data <- read_excel(local_filename)

filtered_data <- subset(excel_data, Sales > 50000)

output_filename <- 'return_data.xlsx'
write_xlsx(filtered_data, output_filename)