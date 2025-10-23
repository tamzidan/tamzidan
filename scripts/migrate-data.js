import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Starting data migration with Prisma...');

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: hashedPassword,
      },
    });
    console.log('✅ Created admin user:', admin.username);

    // Migrate comments if exists
    const commentsPath = path.join(__dirname, '../public/comments.json');
    if (fs.existsSync(commentsPath)) {
      const commentsData = JSON.parse(fs.readFileSync(commentsPath, 'utf8'));
      
      for (const comment of commentsData) {
        const createdComment = await prisma.comment.create({
          data: {
            name: comment.name,
            message: comment.message,
            photo: comment.photo,
            likes: comment.likes || 0,
            isVisible: true,
            createdAt: comment.timestamp ? new Date(comment.timestamp) : new Date()
          }
        });
        console.log(`✅ Migrated comment by ${createdComment.name}`);
      }
    }

    // Create sample portfolio data
    const samplePortfolios = [
      {
        title: 'React Portfolio Website',
        description: 'A modern portfolio website built with React and Tailwind CSS',
        image: '/images/portfolio-1.jpg',
        githubUrl: 'https://github.com/ZainAhmadF28/portfolio',
        liveUrl: 'https://zainahmadfahrezi.vercel.app',
        technologies: JSON.stringify(['React', 'Tailwind CSS', 'JavaScript', 'Vercel']),
        category: 'web',
        featured: true
      },
      {
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce platform with payment integration',
        image: '/images/portfolio-2.jpg',
        githubUrl: 'https://github.com/ZainAhmadF28/ecommerce',
        liveUrl: 'https://example-ecommerce.vercel.app',
        technologies: JSON.stringify(['Next.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS']),
        category: 'web',
        featured: true
      }
    ];

    for (const portfolio of samplePortfolios) {
      const createdPortfolio = await prisma.portfolio.create({
        data: portfolio
      });
      console.log(`✅ Created portfolio: ${createdPortfolio.title}`);
    }

    // Create sample certificates
    const sampleCertificates = [
      {
        title: 'JavaScript Fundamentals',
        issuer: 'Dicoding',
        description: 'Certificate for completing JavaScript fundamentals course',
        imageUrl: '/certificate-images/Belajar Dasar Pemrograman JavaScript.jpg',
        pdfUrl: '/certificates/Belajar Dasar Pemrograman JavaScript.pdf',
        issueDate: new Date('2023-01-15T00:00:00.000Z')
      },
      {
        title: 'React Development',
        issuer: 'Dicoding',
        description: 'Certificate for completing React development course',
        imageUrl: '/certificate-images/Belajar Membuat Aplikasi Web dengan React.jpg',
        pdfUrl: '/certificates/Belajar Membuat Aplikasi Web dengan React.pdf',
        issueDate: new Date('2023-03-20T00:00:00.000Z')
      }
    ];

    for (const certificate of sampleCertificates) {
      const createdCertificate = await prisma.certificate.create({
        data: certificate
      });
      console.log(`✅ Created certificate: ${createdCertificate.title}`);
    }

    console.log('🎉 Data migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();