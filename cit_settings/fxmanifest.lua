-- Resource Metadata
fx_version 'cerulean'
games { 'rdr3', 'gta5' }

author 'Lubricant Jam'
description 'CIT UI'
version '1.0.0'

-- What to run
client_scripts {
    'client/*.lua'
}

ui_page_preload "yes"
ui_page "html/index.html"

files {
	"html/css/*",
	"html/js/*",
	"html/img/*",
	"html/*"
}