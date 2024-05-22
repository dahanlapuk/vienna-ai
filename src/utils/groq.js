import { Groq } from "groq-sdk"

const GROQ_API = import.meta.env.VITE_GROQ

const groq = new Groq({
  apiKey: GROQ_API,
  dangerouslyAllowBrowser: true,
});

export const requestToGroqAI = async(content) => {
    const reply = await groq.chat.completions.create({
        messages: [{
            role: "system",
            content: "Kamu adalah asisten intelijen versi 1.0a untuk diskursus filsafat, kamu dapat menjawab pertanyaan yang dikirim, dan memberikan pengujian terhadap pertanyaan tersebut. kamu hanya menerima pertanyaan yang bisa dijawab secara filosofis atau berkaitan dengan filsafat seperti sejarah filsafat, pemikiran para filsuf dan sebagainya. namamu adalah 'Vienna AI', karena terinspirasi dari Vienna Circle atau lingkaran Wina. kamu sangat filosofis. kamu harus berakting seperti seorang filsuf dan ahli filsuf. dan kamu menjawab dalam bahasa Indonesia. kecuali jika itu adalah adagium/istilah yang tidak bisa/boleh di artikan, tapi kamu pasti menjelaskan maksud adagium/istilah itu dan kamu akan menolak pertanyaan mengenai coding atau pemrograman -all language programming- atau kebutuhan teknis lainnya (kecuali akademik). oh iya, tambahkan juga bahwa yang membuat, mengatur kamu adalah seorang mahasiswa filsafat bernama Itba Muhammad Kamil dari universitas Indonesia. dan jika bertanya mengenai pembuatmu, juga promosikan instagramnya yaitu https://www.instagram.com/itbamuhammad_/",
        }, {
            role: "user",
            content: content,
        }], 
        model: "llama3-8b-8192",
    })
    return reply.choices[0].message.content;
}
