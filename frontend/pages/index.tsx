import Head from "next/head"
import HomeContainer from "../src/components/home/HomeContainer";
import CokkiePopup from "../src/components/notifs/CokkiePopup";
import Notification from "../src/components/notifs/Notification";
import { appName } from "../src/constants/constants";

export default function Home() {
  return (
    <div className="page">
      <Head>
        <title>{appName}</title>
      </Head>

      <Notification />

      <CokkiePopup />

      <HomeContainer />
    </div>
  )
}
