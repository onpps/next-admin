// app/member/UsersPageContent.tsx
'use client';

import { useCallback, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import useCustomMove from "@/utils/useCustomMove";
import DeviceRegisterModal from '@/components/DeviceRegisterModal';
//import PasswordChangeForm from "@/components/PasswordChangeForm";
import { sweetAlert, sweetConfirm, sweetToast } from '@/utils/sweetAlert';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tooltip } from '@mui/material';
import CustomStepper from "@/components/CustomStepper";
import { getDeviceList, startDevice, stopDevice, changeNumberOfSongLimit, resetNumberOfSongRequests, unpairDevice } from '@/api/deviceApi';
import { Device } from '@/types/Device';

interface deviceParam {
  id: string;
  storeId: string;
}

interface limitParam {
  id: string;
  storeId : string;
  numberOfSongLimit: number;
}

export default function UsersPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { page, size } = useCustomMove();
  const [devices, setDevices] = useState<Device[]>();

  const loadDeviceList = useCallback(async () => {
    try {
      const data = await getDeviceList({ page, size });
      setDevices(data);
    } catch (error) {
      console.log("단말기 데이터를 불러오는 중 에러 발생:", error);
      alert("서버 통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }, [page, size]); 

  const handleStop = (deviceId: string, storeId: string) => {
    sweetConfirm(`단말기를 차단 하시겠습니까?`, 'question', async () => {
      const param: deviceParam = { id: deviceId, storeId: storeId };
      try {
        const data = await stopDevice(param);
        if (data.errorCode === 'notExist') {
          sweetAlert(data.errorMessage, '', 'info', '닫기');
          return;
        }
        sweetToast('단말기가 차단 되었습니다.\n차단된 계정은 음악신청이 불가합니다.');
        loadDeviceList();
      } catch (error) {
        alert("오류발생:" + error);
      }
    });
  };

  const handleResume = (deviceId: string, storeId: string) => {
    sweetConfirm(`단말기를 사용재개 하시겠습니까?`, 'question', async () => {
      const param: deviceParam = { id: deviceId, storeId: storeId };
      try {
        const data = await startDevice(param);
        if (data.errorCode === 'notExist') {
          sweetAlert(data.errorMessage, '', 'info', '닫기');
          return;
        }
        sweetToast('단말기가 사용재개 되었습니다.\n음악신청 가능합니다.');
        loadDeviceList();
      } catch (error) {
        alert("오류발생:" + error);
      }
    });
  };

  const handleValueChange = async (id: string, storeId: string, newValue: number) => {
    console.log("id", id);
    console.log("storeId:", storeId);  
    console.log("변경된 값:", newValue);

      const param: limitParam = { id: id, storeId: storeId, numberOfSongLimit: newValue };
      try {
        const data = await changeNumberOfSongLimit(param);
        console.log("data=>" + JSON.stringify(data));
        if (data.errorCode === 'notExist' || data.errorCode === 'authFail') {
          sweetAlert(data.errorMessage, '', 'info', '닫기');
          return;
        }
        sweetToast('신청가능 갯수가 수정되었습니다.');
        loadDeviceList();
      } catch (error) {
        alert("오류발생:" + error);
      }
  };

  const handleResetCount = (deviceId: string, storeId: string) => {
    sweetConfirm(`신청곡 갯수를 초기화 하시겠습니까?`, 'question', async () => {
      try {
        const param: deviceParam = { id: deviceId, storeId: storeId };
        const data = await resetNumberOfSongRequests(param);

        if (data.errorCode === 'notExist' || data.errorCode === 'authFail') {
          sweetAlert(data.errorMessage, '', 'info', '닫기');
          return;
        }

        sweetToast('신청곡 갯수가 초기화되었습니다.');
        loadDeviceList();
      } catch (error) {
        alert("오류발생:" + error);
      }
    });
  };

  const handleUnpair = async (deviceId : string, storeId : string) => {
    sweetConfirm(`연결 해제하시겠습니까?`, 'question', async () => {
      try {
       /* await fetch("/api/device/unpair", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deviceId }),
        }); */

        const param: deviceParam = { id: deviceId, storeId: storeId };
        const data = await unpairDevice(param);

        console.log("data=>" + data);

        sweetAlert("연결 해제 완료", "", "success", "닫기");
        loadDeviceList();
      } catch (e) {
        console.log(e);
        sweetAlert("연결 해제 실패", "", "error", "닫기");
      }
    });
  };

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("https://music-q.co.kr/ws-device"),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe("/topic/device", (message: IMessage) => {
        const data = JSON.parse(message.body);

        console.log("data=>" + JSON.stringify(data));

        if (data.type === "PAIRING_SUCCESS") {
          loadDeviceList();
        }

        if (data.type === "UNPAIR") {
          loadDeviceList();
        }
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    loadDeviceList();
  }, [loadDeviceList]);


  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-white">단말기 관리</h1>

      <div className="border border-gray-300 rounded p-4 mb-6 bg-white shadow">
        <div className="grid grid-cols-1">
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 flex items-center gap-1"
            >
              ➕ 단말기 등록
            </button>
          </div>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1200 }} aria-label="Member Table">
          <TableHead>
            <TableRow>
              {['테이블', '단말기 이름', '페어링 코드', '상태', '신청곡갯수' , '신청가능갯수', '등록일', '관리'].map((title) => (
                <TableCell key={title} align="center" sx={{ fontWeight: 'bold' }}>
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {devices?.map((device: Device) => (
              <TableRow key={device.id}>
                <TableCell align="center">{device.tableNo}</TableCell>
                <TableCell align="center">{device.deviceName}</TableCell>
                <TableCell align="center">{device.pairCode}</TableCell>
                <TableCell align="center">
                    {device.paired ? (
                      <span className="text-green-500">● 온라인</span>
                    ) : (
                      <span className="text-gray-400">● 미등록</span>
                    )}
                </TableCell>
                <TableCell align="center">{device.numberOfSongRequests}</TableCell>
                <TableCell align="center">
                  <CustomStepper value={device.numberOfSongLimit} onChange={(newValue) => handleValueChange(device.id, device.storeId, newValue)} />
                </TableCell>
                <TableCell align="center">{device.regDate}</TableCell>
                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <Tooltip title="신청곡 갯수 0으로 초기화" arrow>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => handleResetCount(device.id, device.storeId)}
                      >
                       신청곡 갯수 초기화
                      </Button>
                    </Tooltip>

                    {/* 🔥 추가된 부분 */}
                    {device.paired && (
                      <Tooltip title="현재 연결된 태블릿 연결 해제" arrow>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleUnpair(device.id, device.storeId)}
                        >
                          연결해제
                        </Button>
                      </Tooltip>
                    )}

                    <Tooltip title="태블릿 신청곡 차단" arrow>
                      <Button
                        variant="contained"
                        color={device.useYn === 'N' ? 'success' : 'error'}
                        size="small"
                        onClick={() =>
                          device.useYn === 'N' ? handleResume(device.id, device.storeId) : handleStop(device.id, device.storeId)
                        }
                      >
                        {device.useYn === 'N' ? '해제' : '차단'}
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeviceRegisterModal
        visible={isModalOpen}
        onRefresh={() => loadDeviceList()}
        onClose={() => setIsModalOpen(false)}
      />
  
    </div>
  );
}
