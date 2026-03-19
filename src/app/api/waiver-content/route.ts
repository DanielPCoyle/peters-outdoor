import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_CONTENT = `<h2>RELEASE OF LIABILITY, WAIVER OF CLAIMS, AND ASSUMPTION OF RISK AGREEMENT</h2>
<p>In consideration of being permitted to participate in guided kayak eco-tours and related activities ("Activities") offered by W.H. Peters Outdoor Adventures ("Company"), I, the undersigned participant, agree to the following:</p>
<h3>1. ASSUMPTION OF RISK</h3>
<p>I understand and acknowledge that kayaking and water-based outdoor activities involve inherent risks, dangers, and hazards including but not limited to: drowning, capsizing, collision with watercraft or submerged objects, exposure to wildlife, adverse weather conditions, physical exhaustion, and personal injury or death. I voluntarily assume all risks associated with participation in the Activities.</p>
<h3>2. RELEASE OF LIABILITY</h3>
<p>I hereby release, waive, and discharge W.H. Peters Outdoor Adventures, its owners, employees, guides, and agents (collectively "Released Parties") from any and all claims, demands, losses, damages, actions, causes of action, or liability of any kind arising out of or related to my participation in the Activities, whether caused by negligence of the Released Parties or otherwise.</p>
<h3>3. MEDICAL AUTHORIZATION</h3>
<p>I certify that I am physically fit and have no medical conditions that would prevent safe participation. I authorize the Released Parties to obtain emergency medical treatment on my behalf should I become incapacitated and unable to make such a decision myself.</p>
<h3>4. EQUIPMENT AND SAFETY</h3>
<p>I agree to follow all safety instructions provided by the guide, wear a properly fitted personal flotation device (PFD) at all times while on the water, and use all equipment in the manner instructed. I understand that failure to follow instructions may result in removal from the activity without refund.</p>
<h3>5. INDEMNIFICATION</h3>
<p>I agree to indemnify and hold harmless the Released Parties from any loss, liability, damage, or cost they may incur due to my participation in the Activities, whether caused by negligence or otherwise.</p>
<h3>6. GOVERNING LAW</h3>
<p>This agreement shall be governed by the laws of the State of Maryland. If any provision is found unenforceable, the remaining provisions shall continue in full force and effect.</p>
<h3>7. ACKNOWLEDGMENT</h3>
<p>I have read this agreement carefully, understand its contents, and sign it voluntarily. I am 18 years of age or older, or if a minor, this form is being signed by my parent or legal guardian.</p>`;

export async function GET() {
  try {
    const row = await prisma.settings.findUnique({ where: { key: "waiver_content" } });
    return NextResponse.json({ content: row?.value ?? DEFAULT_CONTENT });
  } catch {
    return NextResponse.json({ content: DEFAULT_CONTENT });
  }
}
