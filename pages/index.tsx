import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { SearchDialog } from '@/components/SearchDialog'
import Image from 'next/image'
import Link from 'next/link'
import svg from "./learnquantum.svg"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>StellarGPT</title>
        <meta
          name="description"
          content="Semantic Search enabled by NextJs, Pinecone"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.center}>
          <SearchDialog />
        </div>
        <div className="flex justify-between py-8 w-full items-center">  
          <div>
            <Image src='https://soroban.stellar.org/img/landing/image-4.svg' alt="Stellar Image 4" width={300} height={300} />
          </div>    
        </div>
        
        <div className="absolute bottom-0 right-0">
        <Image src='https://soroban.stellar.org/img/landing/image-2.svg' alt="Stellar Image 2" width={400} height={400} />
        </div>
        
        <div className="py-8 w-full flex items-center justify-center space-x-6">
          <div className="opacity-75 transition hover:opacity-80 cursor-pointer">
            <Link href="https://www.learnquantum.co/" className="flex items-center justify-center">
              <p className="text-base text-gray-200 mr-2">Built by LearnQuantum</p>
              <Image src={svg} width="40" height="40" alt="LearnQuantum logo" />

            </Link>
          </div>
        </div>
        

      </main>
    </>
  )
}
