<template>
    <v-no-ssr>
        <v-row class="flex-nowrap">
            <v-col md="auto">
                <v-card class="mt-4">
                    <v-list min-width="300px" min-height="600px" :disabled="loadingResponse">
                        <v-list-subheader>Chats</v-list-subheader>
                        <v-list-item v-for="(chat, i) in chats" :key="i">
                            <v-row>
                                <v-col align-self="center">
                                    <v-text-field v-if="renameChatIndex == i" variant="outlined" hide-details
                                        v-model="chat.name" density="compact" @keydown.enter="saveChats()"
                                        :autofocus="true">
                                    </v-text-field>
                                    <v-btn v-else color="grey-darken-1" :active="activeChat == i" variant="text"
                                        @click="selectChat(i)">
                                        <v-icon start>mdi-chat</v-icon>
                                        {{ chat.name }}
                                    </v-btn>
                                </v-col>
                                <v-col md="auto" align-self="center">
                                    <v-btn v-if="renameChatIndex != i" color="grey-darken-1" icon="mdi-pencil" size="small"
                                        variant="text" title="Rename Chat" @click="renameChatIndex = i"></v-btn>
                                    <v-btn v-else color="grey-darken-1" icon="mdi-check-bold" size="small" variant="text"
                                        @click="saveChats"></v-btn>

                                    <v-btn color="grey-darken-1" icon="mdi-delete" size="small" variant="text"
                                        title="Delete Chat" @click="deleteChat(i)"></v-btn>
                                </v-col>
                            </v-row>
                        </v-list-item>

                        <v-list-item :value="-1" prepend-icon="mdi-plus" :active="activeChat == -1" @click="newChat()">
                            <v-list-item-title>Add new Chat</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <v-col>
                <v-card class="mt-4" v-for="(message, i) in chats[activeChat].messages" :key="i" :loading="i == chats[activeChat].messages.length - 1 && loadingResponse
                    ">
                    <v-card-title :class="roleToClass(message.role)">
                        <v-row>
                            <v-col>
                                <v-icon start>
                                    {{ roleToIcon(message.role) }}
                                </v-icon>
                                {{ roleToName(message.role) }}
                            </v-col>
                            <v-col md="auto" v-if="message.role == 'assistant' && ishttps">
                                <v-btn icon="mdi-content-copy" variant="text" size="x-small"
                                    @click="copy(message.content)" />
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-card-text :class="roleToClass(message.role)">
                        <VueShowdown :markdown="message.content" flavor="github" />
                    </v-card-text>
                </v-card>

                <v-card class="mt-4" :disabled="loadingResponse || limitReached">
                    <v-card-title :class="roleToClass('user')">
                        <v-icon start>
                            {{ roleToIcon("user") }}
                        </v-icon>
                        {{ roleToName("user") }}
                    </v-card-title>
                    <v-card-text :class="roleToClass('user')">
                        <v-textarea :disabled="loadingResponse || limitReached" variant="outlined" hide-details auto-grow
                            label="Type in your prompt here. You can use natural language." v-model="newMessage"
                            @keydown.enter.ctrl.exact.prevent="sendMessage()">
                            <template v-slot:append>
                                <v-btn icon="mdi-send" variant="text" @click="sendMessage()">
                                </v-btn>
                            </template>
                        </v-textarea>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-no-ssr>
</template>
<script lang="ts">
export default {
    mounted() {
        if (localStorage.savedChats) {
            const savedChats = JSON.parse(localStorage.savedChats);
            this.chats = savedChats;
        } else {
            this.chats[0].messages = [];
        }

        if (location.protocol != "https:") {
            this.ishttps = false;
        }
    },
    data() {
        return {
            ishttps: true,
            newMessage: "",
            limitReached: false,
            activeChat: 0,
            loadingResponse: false,
            renameChatIndex: -1,
            chats: [
                {
                    name: "Chat",
                    messages: [{ role: "", content: "" }],
                },
            ],
        }
    },
    methods: {
        copy(text: string) {
            if (process.client) {
                navigator.clipboard.writeText(text);
            }
        },
        newChat() {
            const index = this.chats.push({
                name: "Chat",
                messages: [],
            });

            this.activeChat = index - 1;
        },
        deleteChat(i: number) {
            this.chats.splice(i, 1);

            if (this.activeChat >= i) {
                this.activeChat -= 1;
            }

            if (this.chats.length <= 0) {
                this.chats.push({
                    name: "Chat",
                    messages: [],
                });
                this.activeChat = 0;
            }

            localStorage.savedChats = JSON.stringify(this.chats);
        },
        saveChats() {
            this.renameChatIndex = -1;
            localStorage.savedChats = JSON.stringify(this.chats);
        },
        selectChat(i: number) {
            this.activeChat = i;
        },
        async sendMessage() {
            this.chats[this.activeChat].messages.push({
                role: "user",
                content: this.newMessage,
            });
            this.chats[this.activeChat].messages.push({
                role: "assistant",
                content: "",
            });
            this.newMessage = "";

            this.loadingResponse = true;
            const response = await fetch("/api/chat", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: this.chats[this.activeChat].messages,
                }),
            });

            if (response.status == 429) {
                this.limitReached = true;
                return;
            }

            if (response.body == null) {
                return;
            }


            const index = this.chats[this.activeChat].messages.length - 1;
            const message = this.chats[this.activeChat].messages[index];

            const reader = response.body
                .pipeThrough(new TextDecoderStream())
                .getReader();

            let value, done;
            while (!done) {
                ({ value, done } = await reader.read());
                if (done) {
                    break;
                }
                message.content += value;
            }

            this.loadingResponse = false;
            localStorage.savedChats = JSON.stringify(this.chats);
        }
    },
}
</script>