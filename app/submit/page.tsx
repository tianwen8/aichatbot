import { Metadata } from "next";
import SubmitForm from "@/components/submit-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "提交网站 | 添加您喜爱的AI聊天工具",
  description: "提交您的AI聊天网站或工具以供收录。提交后将进行审核，并在批准后发布到我们的目录中。",
};

export default function SubmitPage() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回首页
        </Link>
      </div>
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">提交AI网站</h1>
          <p className="text-muted-foreground mt-2">
            添加您喜爱的AI聊天工具或网站到我们的目录中。提交的内容将经过审核，并在批准后发布。
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">提交指南</h3>
              <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>网站必须是AI聊天相关工具或资源</li>
                <li>提供完整且准确的信息</li>
                <li>Logo必须清晰可见</li>
                <li>网站必须可访问且功能正常</li>
                <li>提交后请耐心等待审核</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">自动截图</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                输入网址后系统将自动采集网站截图。您也可以上传自定义截图。
              </p>
              <div className="mt-4 flex items-center gap-4">
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  采集截图
                </button>
              </div>
              <div className="mt-4 rounded-md border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">预览区域：截图将显示在这里</p>
              </div>
            </div>
          </div>
          <div>
            <SubmitForm />
          </div>
        </div>
      </div>
    </div>
  );
} 