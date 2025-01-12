import { Chat } from "@/models/chat";
import { ChatMessage } from "@/models/chat-message";
import { dateTimeFormat } from "@/utils/common";

export function ChatMessageComponent({ chat, message }: { chat: Chat, message: ChatMessage }) {
    return (
        <div className="w-full block my-4 "> 
            <div key={message.message_index} className={`w-4/5 p-5 ${message.from === 'candidate' ? 
                'bg-blue-500 text-white float-start' : 'float-end bg-white text-black'} rounded-lg`}>
                <div className="text-xs">
                    {message.from === 'candidate' ? 'You' : message.from === 'contact' ? chat?.contact?.contact_name : chat?.staff?.staff_name}
                </div>
                <div className="py-2.5">
                    <p className="text-sm leading-tight tracking-tight">{message.message}</p>
                    <span className="text-xs tracking-tight mt-1 float-end">
                        {dateTimeFormat(message.created_at || '', 'hh:mm a')}
                    </span>
                </div>
            </div> 
            <div className="clear-both"></div>
        </div>
    );
}
