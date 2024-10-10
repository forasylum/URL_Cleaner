require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js")

const botID = process.env.BOTID
const serverID = process.env.SERVERID
const token = process.env.TOKEN

const rest = new REST().setToken(token)
const slashRegister = async () => {
	try {
		await rest.put(Routes.applicationGuildCommands(botID, serverID), {
			body: [
				new SlashCommandBuilder()
				.setName("단축")
				.setDescription("추적 태그를 삭제합니다.")
				.addStringOption(option => {
					return option
					.setName("link")
					.setDescription("단축할 링크")
					.setRequired(true)
				})
			]
		})
		console.log('완료');
	} catch (error) {
		console.log(error)
	}
}
slashRegister();