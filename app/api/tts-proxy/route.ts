import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json(); // 获取前端发送过来的请求体
    const externalTtsUrl = 'https://fond-nina-ballpo-dba04486.koyeb.app/api/tts';

    // 处理请求体格式
    const formattedBody = {
      text: Array.isArray(body.text) ? body.text.filter((t: string) => t.trim()).join('\n\n') : body.text,
      voice: body.voice || 'zh-CN-XiaoxiaoNeural',
      rate: body.rate || '-4%',
      volume: body.volume || '+0%',
      name: body.name
    };

    // 向外部 TTS API 发送请求
    const response = await fetch(externalTtsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果外部 API 需要其他特定 Header，也在这里添加
      },
      body: JSON.stringify(formattedBody) // 发送格式化后的请求体
    });

    // 检查外部 API 的响应状态
    if (!response.ok) {
      // 如果外部 API 返回错误，尝试解析错误信息并返回给前端
      const errorData = await response.json().catch(() => ({ message: '无法解析外部 API 错误信息' }));
      console.error("External TTS API Error:", response.status, response.statusText, errorData);
      // 返回一个包含错误状态和信息的响应给前端
      return NextResponse.json(
        { message: `外部 TTS API 错误: ${response.status} ${response.statusText} - ${errorData.message || ''}` },
        { status: response.status } // 将外部 API 的错误状态码传递给前端
      );
    }

    // 如果外部 API 请求成功，可以直接将外部 API 的成功响应体转发给前端
    // 或者，如果只需要特定信息（比如确认成功），可以返回自定义信息
    // 这里我们假设成功时不需要特定数据返回给前端，只需要知道成功即可
    // 外部 API 成功时可能返回空内容或特定状态码，根据实际情况调整
    // const responseData = await response.json(); // 如果需要处理返回数据
    // return NextResponse.json(responseData);

    // 假设成功时，我们只需要返回一个成功的状态给前端
    // 前端仍然需要根据发送的 filename 构建 GET URL
    return NextResponse.json({ success: true, filename: body.name }, { status: 200 });

  } catch (error) {
    console.error("TTS Proxy Error:", error);
    // 处理请求过程中的内部错误
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '代理请求时发生内部错误' },
      { status: 500 }
    );
  }
}