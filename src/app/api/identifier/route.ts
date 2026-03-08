import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, phoneNumber } = await req.json();
    const phoneStr = phoneNumber?.toString() || null;

    const matches = await prisma.contact.findMany({
      where: { OR: [{ email: email || undefined }, { phoneNumber: phoneStr || undefined }] },
    });

    if (matches.length === 0) {
      const newC = await prisma.contact.create({
        data: { email, phoneNumber: phoneStr, linkPrecedence: 'primary' }
      });
      return NextResponse.json({ contact: { primaryContatctId: newC.id, emails: [newC.email].filter(Boolean), phoneNumbers: [newC.phoneNumber].filter(Boolean), secondaryContactIds: [] } });
    }

    const primaryIds = new Set<number>();
    matches.forEach(m => primaryIds.add(m.linkedId || m.id));
    const primaries = await prisma.contact.findMany({
      where: { id: { in: Array.from(primaryIds) } },
      orderBy: { createdAt: 'asc' }
    });

    const root = primaries[0];

    if (primaries.length > 1) {
      const others = primaries.slice(1).map(p => p.id);
      await prisma.contact.updateMany({
        where: { OR: [{ id: { in: others } }, { linkedId: { in: others } }] },
        data: { linkedId: root.id, linkPrecedence: 'secondary' }
      });
    }

    const emailEx = matches.some(m => m.email === email);
    const phoneEx = matches.some(m => m.phoneNumber === phoneStr);
    if ((email && !emailEx) || (phoneStr && !phoneEx)) {
      await prisma.contact.create({ data: { email, phoneNumber: phoneStr, linkedId: root.id, linkPrecedence: 'secondary' } });
    }

    const all = await prisma.contact.findMany({
      where: { OR: [{ id: root.id }, { linkedId: root.id }] },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      contact: {
        primaryContatctId: root.id,
        emails: [...new Set(all.map(r => r.email).filter(Boolean))],
        phoneNumbers: [...new Set(all.map(r => r.phoneNumber).filter(Boolean))],
        secondaryContactIds: all.filter(r => r.linkPrecedence === 'secondary').map(r => r.id)
      }
    });
  } catch (e) { console.error('[/api/identifier]', e); return NextResponse.json({ error: 'Internal Error' }, { status: 500 }); }
}