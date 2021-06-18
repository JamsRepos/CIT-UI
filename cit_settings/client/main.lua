------------------------------------------------------------------------------------
--  PROJECT:     Community of Integrity and Transparency
--  RIGHTS:      All rights reserved by developers
--  FILE:        CITsettings/client.lua
--  PURPOSE:     client
--  DEVELOPERS:  HassoN
------------------------------------------------------------------------------------

local isUIopen = false
local userSettings = {}
local categories = {
	{"Audio Settings", "Audio"},
	{"Miscellaneous Settings", "Misc"},
}
local settingsList = {
	{category = "Audio", name = "disableCustomSounds", friendly = "Disable Custom Sounds", options = {"Yes", "No"}, defaultValue = "No", description = "Disable custom sounds such as prison break siren/police callouts."},
	{category = "Audio", name = "customSoundsVolume", friendly = "Custom Sounds Volume", options = "input", defaultValue = 50, description = "Set custom sounds volume such as prison break siren/police callouts.", placeholder = "from 0 to 100", maximum = 100, minimum = 0},
	{category = "Misc", name = "autopayjailfine", friendly = "Automatically Pay Jail Fines", options = {"Yes", "No"}, defaultValue = "No", description = "Does /payjailfine automatically everytime you go to prison."},
}

function loadSettings()
	local settingsString = GetResourceKvpString("settings")
	if (not settingsString) then
		for index, data in ipairs(settingsList) do
			table.insert(userSettings, data)
		end
		SetResourceKvp("settings", json.encode(userSettings))
	else
		local myTable = json.decode(settingsString)
		if (#myTable ~= #settingsList) then
			SetResourceKvp("settings", json.encode(settingsList))
		end
	end
	userSettings = json.decode(GetResourceKvpString("settings"))
end
CreateThread(loadSettings)

function toggleUI(myList)
	isUIopen = not isUIopen
	SendNUIMessage({
		show = isUIopen,
		settingsList = settingsList,
		categories = categories,
		userSettings = userSettings,
	})
	SetNuiFocus(isUIopen, isUIopen)
end
RegisterCommand("settings", toggleUI)

RegisterNUICallback("close", function(data)
	SetNuiFocus(false, false)
	isUIopen = false
end)

RegisterNUICallback("doaction", function(data)
	SetNuiFocus(false, false)
	isUIopen = false
	local action = data.action
	local name = data.selectedSettingCode
	local index = getSettingsIndexFromName(name)
	if (action == "resetall") then
		SetResourceKvp("settings", json.encode(settingsList))
		userSettings = settingsList
		exports.CITmisc:outputChatBox("All settings have been set to default!", 0, 255, 0)
		return true
	elseif (action == "reset") then
		local defaultValueFromTable = false
		for _, data in ipairs(settingsList) do
			if (data.name == name) then
				defaultValueFromTable = data.defaultValue
				break;
			end
		end
		setPlayerSetting(name, defaultValueFromTable)
		exports.CITmisc:outputChatBox("Settings have been successfully updated!", 0, 255, 0)
		return true;
	else
		if (settingsList[index].options == "input") then
			value = tonumber(data.selectedSettingUpdatedValue)
		else
			value = data.selectedSettingUpdatedValue
		end
		if (not value) then
			exports.CITmisc:outputChatBox("Invalid value.", 255, 0, 0)
			return false
		end
		if (settingsList[index].options == "input") then
			if (value < settingsList[index].minimum or value > settingsList[index].maximum) then
				exports.CITmisc:outputChatBox("Too big or too small value.", 255, 0, 0)
				return false
			end
		end
		setPlayerSetting(name, value)
		exports.CITmisc:outputChatBox("Settings have been successfully updated!", 0, 255, 0)
	end
end)

function getSettingsIndexFromName(name)
	for index, data in ipairs(settingsList) do
		if (data.name == name) then
			return index
		end
	end
end

function getPlayerSetting(name)
	for _, data in ipairs(userSettings) do
		if (data.name == name) then
			return data.defaultValue
		end
	end
	for _, data in ipairs(settingsList) do
		if (data.name == name) then
			return data.defaultValue
		end
	end
end

function setPlayerSetting(settingName, value)
	local index = getSettingsIndexFromName(settingName)
	userSettings[index].defaultValue = value
	SetResourceKvp("settings", json.encode(userSettings))
	TriggerEvent("onClientPlayerSettingChange", settingName, value)
end

-- Fix glitch

function hideAllUIs()
	isUIopen = false
	SetNuiFocus(false, false)
	SendNUIMessage({
		show = false,
	})
end
RegisterNetEvent("hideAllUIs")
AddEventHandler("hideAllUIs", hideAllUIs)