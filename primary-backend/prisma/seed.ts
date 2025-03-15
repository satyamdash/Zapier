import  {prisma}  from "../src/db";

async function SeedUsers (){
    await prisma.availableTrigger.create({
        data: {
            id: "webhook",
            name: "webhook",
            image: "https://media.licdn.com/dms/image/v2/D4D12AQHtrdLcx2NuzQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1709325806317?e=2147483647&v=beta&t=DUaFfcSvxvwZCn00XhUncL3j8xFHJaSI_pcyYBrqX_4",
        }
    })

    await prisma.availableAction.create({
        data: {
            id: "email",
            name: "SendEmail",
            image: "https://cdn.pixabay.com/photo/2017/11/10/05/42/email-2935508_1280.png",
        },

    });

    await prisma.availableAction.create({
        data: {
            id: "sol",
            name: "SendSolana",
            image: "https://www.chainalysis.com/wp-content/uploads/2022/08/shutterstock-2176242673-scaled-1-1500x970.jpg",
        }
    })


    
}

SeedUsers();