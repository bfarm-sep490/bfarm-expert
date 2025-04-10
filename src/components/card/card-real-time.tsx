// import { useState, useEffect } from "react";
// import mqtt from "mqtt";
// import { Card, Typography } from "antd";

// // Define the props type for the RealTimeContentCard component
// type RealTimeEnvironmentProps = {
//   component_id: string;
//   channel_name: string;
//   title: string;
//   icon: React.ReactNode;
// };

// // RealTimeContentCard Component
// export const RealTimeContentCard = ({
//   component_id,
//   channel_name,
//   title,
//   icon,
// }: RealTimeEnvironmentProps) => {
//   const [value, setValue] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const client = mqtt.connect("wss://test.mosquitto.org:8081");
//     client.on("connect", () => {
//       console.log("Connected to MQTT Broker");
//       client.subscribe(channel_name, (err) => {
//         setLoading(false);
//         if (err) {
//           console.error("Subscription error:", err);
//           setError("Không kết nối được");
//         } else {
//           console.log("Subscribed to", channel_name);
//           setError(null);
//         }
//       });
//     });

//     client.on("message", (topic, message) => {
//       console.log("Message received on", topic, ":", message.toString());
//       try {
//         const messageJson = JSON.parse(message.toString());
//         setValue(messageJson?.content ?? "N/A");
//       } catch (e) {
//         console.error("Error parsing MQTT message:", e);
//         setError("Lỗi phân tích dữ liệu");
//       }
//     });

//     client.on("error", (err) => {
//       console.error("MQTT Error:", err);
//       setError("Không kết nối được");
//     });

//     return () => {
//       if (client.connected) {
//         client.end(true);
//         console.log("Disconnected from MQTT Broker");
//       }
//     };
//   }, [channel_name]);

//   return (
//     <Card loading={loading} title={<span>{title}</span>} extra={icon}>
//       {error ? (
//         <Typography.Text type="danger" style={{ textAlign: "center", display: "block" }}>
//           {error}
//         </Typography.Text>
//       ) : (
//         <Typography.Title id={component_id} style={{ fontWeight: "bold", textAlign: "center" }}>
//           {value ?? "--"}
//         </Typography.Title>
//       )}
//     </Card>
//   );
// };
