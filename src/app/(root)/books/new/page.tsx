import { UploadForm } from "@/components/UploadForm";

const Page = () => {
  return (
    <section>
        <div className="flex flex-col gap-4 mx-auto px-5 py-8">
            <h1 className="text-2xl font-bold">Add new book</h1>
            <p className="text-sm text-muted-foreground">Upload a PDF to generate an AI-powered conversation</p>
        </div>
        <UploadForm />
    </section>
  )
}

export default Page;