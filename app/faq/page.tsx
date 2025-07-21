import SiteLayout from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqPage() {
  return (
    <SiteLayout>
      <div className="container py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about PDFlyer and our services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is PDFlyer?</AccordionTrigger>
              <AccordionContent>
                PDFlyer is a web-based application that provides a suite of tools for manipulating PDF files. Our
                platform allows you to merge, split, compress, convert, watermark, and rotate PDFs with ease, all from
                your web browser without the need for any software installation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Is PDFlyer free to use?</AccordionTrigger>
              <AccordionContent>
                PDFlyer offers a free tier that allows you to perform basic PDF operations with some limitations. We
                also offer Pro and Business plans with additional features, higher file size limits, and no ads. You can
                view our pricing details on our{" "}
                <Link href="/pricing" className="text-primary hover:underline">
                  Pricing page
                </Link>
                .
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How secure are my PDF files with PDFlyer?</AccordionTrigger>
              <AccordionContent>
                Security is our top priority. PDFlyer processes files in your browser whenever possible, meaning your
                files never leave your computer. When server processing is necessary, files are encrypted during
                transfer, processed, and then immediately deleted. We never store the content of your documents on our
                servers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>What are the file size limits?</AccordionTrigger>
              <AccordionContent>
                File size limits depend on your plan. Free users can upload files up to 10MB, Pro users up to 100MB, and
                Business users up to 500MB. If you need to process larger files, please contact our support team for
                custom solutions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Can I use PDFlyer on my mobile device?</AccordionTrigger>
              <AccordionContent>
                Yes! PDFlyer is fully responsive and works on smartphones and tablets. Our interface adapts to your
                screen size, providing a seamless experience whether you're on desktop or mobile.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>How do I merge multiple PDF files?</AccordionTrigger>
              <AccordionContent>
                To merge PDFs, go to the Tools page and select "Merge PDFs". Upload the files you want to combine,
                arrange them in the desired order by dragging and dropping, and click "Merge PDFs". Once processing is
                complete, you can download the merged document.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>Can I convert PDFs to other file formats?</AccordionTrigger>
              <AccordionContent>
                Yes, PDFlyer allows you to convert PDFs to various formats including Word (DOCX), Excel (XLSX),
                PowerPoint (PPTX), images (JPG, PNG), text (TXT), and HTML. Simply use our Convert tool to transform
                your PDFs into the format you need.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
              <AccordionContent>
                You can cancel your subscription at any time from your account settings. Go to Settings &gt;
                Subscription and click "Cancel Subscription". Your subscription will remain active until the end of your
                current billing period.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
              <AccordionContent>
                We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service
                within the first 14 days, contact our support team for a full refund.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>How can I get help if I have a problem?</AccordionTrigger>
              <AccordionContent>
                We offer several support channels. You can visit our{" "}
                <Link href="/support" className="text-primary hover:underline">
                  Support Center
                </Link>
                , email us at support@pdflyer.com, or use the live chat feature if you're on a Pro or Business plan. We
                aim to respond to all inquiries within 24 hours.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">Didn't find what you're looking for? Contact our support team.</p>
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
