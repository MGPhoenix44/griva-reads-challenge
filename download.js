import { kv } from '@vercel/kv';
import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  HeadingLevel, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType, PageBreak,
} from 'docx';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'grivareads2025';

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid password.' });
  }

  try {
    const raw = await kv.lrange('griva-submissions', 0, -1);
    const submissions = raw.map((item) =>
      typeof item === 'string' ? JSON.parse(item) : item
    );

    // Sort by submission date (oldest first)
    submissions.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

    // Build Word document
    const children = [];

    // Title page content
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 2400, after: 200 },
        children: [
          new TextRun({
            text: 'GRIVA READS',
            bold: true,
            size: 48,
            font: 'Georgia',
            color: '8B4513',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: 'The Unchosen Path Challenge',
            bold: true,
            size: 36,
            font: 'Georgia',
            color: '333333',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: 'Alternative Ending Submissions',
            italics: true,
            size: 24,
            font: 'Georgia',
            color: '666666',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: `${submissions.length} ${submissions.length === 1 ? 'submission' : 'submissions'} received`,
            size: 22,
            font: 'Georgia',
            color: '888888',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        children: [
          new TextRun({
            text: `Generated: ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
            size: 20,
            font: 'Georgia',
            color: '999999',
            italics: true,
          }),
        ],
      })
    );

    // Each submission
    submissions.forEach((sub, index) => {
      const submittedDate = new Date(sub.submittedAt).toLocaleDateString('en-GB', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      // Page break before each submission (except first one gets a divider)
      if (index > 0) {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      } else {
        // Divider after title
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
            children: [
              new TextRun({
                text: '— — — — — — — — — —',
                color: 'CCCCCC',
                size: 20,
              }),
            ],
          })
        );
      }

      // Submission header
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `Submission ${index + 1}`,
              bold: true,
              size: 14,
              font: 'Arial',
              color: '999999',
              allCaps: true,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: sub.fullName,
              bold: true,
              size: 28,
              font: 'Georgia',
              color: '333333',
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `Form: ${sub.formClass}`,
              size: 22,
              font: 'Georgia',
              color: '666666',
            }),
            new TextRun({
              text: `    |    ${sub.wordCount} words`,
              size: 22,
              font: 'Georgia',
              color: '888888',
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: `Submitted: ${submittedDate}`,
              size: 18,
              font: 'Georgia',
              color: '999999',
              italics: true,
            }),
          ],
        })
      );

      // Divider line
      children.push(
        new Paragraph({
          spacing: { after: 200 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
          },
          children: [new TextRun({ text: '' })],
        })
      );

      // Story text — split by paragraphs
      const paragraphs = sub.story.split(/\n+/);
      paragraphs.forEach((para, pIndex) => {
        if (para.trim()) {
          children.push(
            new Paragraph({
              spacing: { after: pIndex < paragraphs.length - 1 ? 160 : 0, line: 360 },
              children: [
                new TextRun({
                  text: para.trim(),
                  size: 24,
                  font: 'Georgia',
                  color: '222222',
                }),
              ],
            })
          );
        }
      });
    });

    // No submissions fallback
    if (submissions.length === 0) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 600 },
          children: [
            new TextRun({
              text: 'No submissions received yet.',
              size: 24,
              font: 'Georgia',
              color: '999999',
              italics: true,
            }),
          ],
        })
      );
    }

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { font: 'Georgia', size: 24 },
          },
        },
      },
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      }],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=Griva_Reads_Unchosen_Path_Submissions.docx');
    res.send(buffer);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ error: 'Failed to generate document.' });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
