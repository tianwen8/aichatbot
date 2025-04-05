import SubmitForm from "@/components/submit-form";

export const metadata = {
  title: "提交AI聊天网站 | AI角色聊天导航",
  description: "提交您的AI角色聊天网站、工具或资源到我们的导航目录。增加曝光度，让更多用户发现您的AI聊天应用。",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">提交您的AI聊天网站</h1>
        <p className="mt-4 text-lg text-gray-600">
          将您的AI角色聊天网站、工具或平台添加到我们的导航目录中，让更多人发现它。
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">网站信息</h2>
        <SubmitForm />
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">提交指南</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>所有提交的网站必须与AI聊天或角色扮演相关</li>
          <li>网站必须具有良好的用户体验和有价值的内容</li>
          <li>不允许包含侵犯版权、非法或成人内容的网站</li>
          <li>每个提交都会经过我们团队的审核，通常需要1-3个工作日</li>
          <li>如果您的网站被批准，它将出现在我们的目录中，并可能被推荐到精选部分</li>
        </ul>
      </div>

      <div className="mt-12 bg-indigo-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">为什么要提交到我们的目录？</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">增加曝光度</h3>
            <p className="text-gray-700">让成千上万寻找AI聊天体验的用户发现您的网站。</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">获得目标流量</h3>
            <p className="text-gray-700">从对AI聊天和角色扮演感兴趣的高质量用户中获得流量。</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">提高权威性</h3>
            <p className="text-gray-700">被列入权威目录可以增强您网站的可信度和SEO。</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">与社区建立联系</h3>
            <p className="text-gray-700">成为AI聊天和角色扮演爱好者社区的一部分。</p>
          </div>
        </div>
      </div>

      {/* 添加SEO富文本 */}
      <div className="mt-16 text-sm text-gray-500">
        <h3 className="font-medium mb-2">关于AI角色聊天网站提交</h3>
        <p>
          我们的AI角色聊天导航目录收集了各种AI聊天平台、角色扮演工具和虚拟伴侣应用，
          包括Character.ai、ChatGPT、Claude等知名平台，以及众多创新的AI对话工具。
          提交您的网站到我们的目录，可以帮助您接触到对AI聊天和角色扮演感兴趣的用户群体。
          无论您开发的是AI角色扮演工具、情感伴侣、教育助手还是创意写作伙伴，
          我们的目录都能帮助合适的用户找到您的产品。
        </p>
      </div>
    </div>
  );
} 