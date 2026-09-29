import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

const blogMetadata: Record<string, { title: string; description: string }> = {
  "momentum-over-perfection": {
    title: "Momentum Over Perfection",
    description: "Why shipping fast and iterating beats endless planning. My philosophy on building products and learning in public."
  }
  // Add more blog metadata here as you write new posts
};

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const metadata = blogMetadata[slug];

  if (!metadata) {
    return {
      title: "Blog Not Found"
    };
  }

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;

  // Read the markdown file
  const filePath = path.join(process.cwd(), "src", "content", "blogs", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const metadata = blogMetadata[slug];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        {/* Back Navigation */}
        <Link
          href="/"
          className="group mb-10 inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        {/* Article Header */}
        <header className="mb-12 space-y-6">
          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {metadata?.title || "Blog Post"}
          </h1>
          <p className="text-lg leading-relaxed text-foreground/70 sm:text-xl">
            {metadata?.description}
          </p>
          <div className="flex items-center gap-3 border-l-2 border-emerald-400 pl-4 text-sm text-foreground/50">
            <time dateTime="2025-11-09">November 9, 2025</time>
            <span>•</span>
            <span>{Math.ceil(content.split(/\s+/).length / 200)} min read</span>
          </div>
        </header>

        {/* Article Content */}
        <article
          className="prose prose-neutral max-w-none
            dark:prose-invert prose-lg
            prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
            prose-h1:text-3xl prose-h1:sm:text-4xl
            prose-h2:mt-12 prose-h2:text-2xl prose-h2:sm:text-3xl
            prose-h3:mt-8 prose-h3:text-xl prose-h3:sm:text-2xl
            prose-p:leading-relaxed prose-p:text-foreground/80
            prose-a:font-medium prose-a:text-emerald-400 prose-a:no-underline prose-a:transition-colors hover:prose-a:text-emerald-300 hover:prose-a:underline
            prose-strong:font-semibold prose-strong:text-foreground
            prose-code:rounded prose-code:bg-foreground/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:text-emerald-300 prose-code:before:content-none prose-code:after:content-none
            prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-foreground/5 prose-pre:p-4
            prose-ul:my-6 prose-ul:text-foreground/80
            prose-ol:my-6 prose-ol:text-foreground/80
            prose-li:my-2 prose-li:text-foreground/80
            prose-blockquote:border-l-4 prose-blockquote:border-l-emerald-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/70
            prose-img:rounded-lg prose-img:shadow-lg
          "
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </article>

        {/* Footer CTA */}
        <footer className="mt-16 border-t border-border pt-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Thanks for reading!
              </p>
              <p className="text-sm text-foreground/60">
                If you found this helpful, let&apos;s connect and build together.
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://x.com/anirudh_72dhage"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-foreground/5 px-4 py-2 text-sm font-medium text-foreground/70 transition-all hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-400"
              >
                Twitter
              </a>
              <a
                href="https://github.com/Anirudh63"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-foreground/5 px-4 py-2 text-sm font-medium text-foreground/70 transition-all hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-400"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { slug: "momentum-over-perfection" }
    // Add more blog slugs here as you write new posts
  ];
}
