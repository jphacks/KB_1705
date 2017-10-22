package com.example.doiken.mybluetooth;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Set;
import java.util.UUID;
import android.content.Intent;
import android.net.Uri;
import android.widget.ImageView;

public class MainActivity extends ActionBarActivity implements Runnable, View.OnClickListener {
    /* link */
    private String WebLink = "https://www.navieclipse.com/";

    /* tag */
    private static final String TAG = "BluetoothSample";

    /* Bluetooth Adapter */
    private BluetoothAdapter mAdapter;

    /* Bluetoothデバイス */
    private BluetoothDevice mDevice;

    /* Bluetooth UUID */
    private final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    /* デバイス名 */
    private final String DEVICE_NAME = "RNBT-AAA6";

    /* Soket */
    private BluetoothSocket mSocket;

    /* Thread */
    private Thread mThread;

    /* Threadの状態を表す */
    private boolean isRunning;

    /** 接続ボタン. */
    private Button connectButton;

    /** 書込みボタン. */
    private Button writeButton;

    /** urljump */
    private Button urlJumpButton;

    /** back */
    private Button backButton;

    /** ステータス. */
    private TextView mStatusTextView;

    /** Bluetoothから受信した値. */
    private TextView mInputTextView;

    /** Action(ステータス表示). */
    private static final int VIEW_STATUS = 0;

    /** Action(取得文字列). */
    private static final int VIEW_INPUT = 1;

    /** Connect確認用フラグ */
    private boolean connectFlg = false;

    /** BluetoothのOutputStream. */
    OutputStream mmOutputStream = null;

    /** smell Statue*/
    private TextView mSmellStatusTextView;

    //* image status*/
    private ImageView imageStatus;

    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        imageStatus = (ImageView) findViewById(R.id.statusView);

        mInputTextView = (TextView)findViewById(R.id.inputValue);
        mStatusTextView = (TextView)findViewById(R.id.statusValue);
        mSmellStatusTextView = (TextView)findViewById(R.id.smellStatus);


        connectButton = (Button)findViewById(R.id.connectButton);
        writeButton = (Button)findViewById(R.id.writeButton);
        urlJumpButton = (Button)findViewById(R.id.urlJumpButton);
        backButton = (Button)findViewById(R.id.backButton);

        connectButton.setOnClickListener(this);
        writeButton.setOnClickListener(this);
        urlJumpButton.setOnClickListener(this);
        backButton.setOnClickListener(this);

        // Bluetoothのデバイス名を取得
        // デバイス名は、RNBT-XXXXになるため、
        // DVICE_NAMEでデバイス名を定義
        mAdapter = BluetoothAdapter.getDefaultAdapter();
        mStatusTextView.setText("SearchDevice");
        Set< BluetoothDevice > devices = mAdapter.getBondedDevices();
        for ( BluetoothDevice device : devices){

            if(device.getName().equals(DEVICE_NAME)){
                mStatusTextView.setText("find: " + device.getName());
                mDevice = device;
            }
        }
        if (!connectFlg) {
            mStatusTextView.setText("try connect");

            mThread = new Thread(this);
            // Threadを起動し、Bluetooth接続
            isRunning = true;
            mThread.start();
        }

    }

    @Override
    protected void onPause(){
        super.onPause();

        isRunning = false;
        try{
            mSocket.close();
        }
        catch(Exception e){}
    }

    @Override
    public void run() {
        InputStream mmInStream = null;
        Message valueMsgToAlert = new Message();

        Message valueMsg = new Message();
        valueMsg.what = VIEW_STATUS;
        valueMsg.obj = "connecting...";
        mHandler.sendMessage(valueMsg);

        try{

            // 取得したデバイス名を使ってBluetoothでSocket接続
            mSocket = mDevice.createRfcommSocketToServiceRecord(MY_UUID);

            mSocket.connect();

            mmInStream = mSocket.getInputStream();
            mmOutputStream = mSocket.getOutputStream();

            // InputStreamのバッファを格納
            byte[] buffer = new byte[1024];

            // 取得したバッファのサイズを格納
            int bytes;
            valueMsg = new Message();
            valueMsg.what = VIEW_STATUS;
            valueMsg.obj = "connected.";
            mHandler.sendMessage(valueMsg);

            connectFlg = true;

            while(isRunning){

                // InputStreamの読み込み
                bytes = mmInStream.read(buffer);
                Log.i(TAG,"bytes="+bytes);
                // String型に変換
                String readMsg = new String(buffer, 0, bytes);

                // null以外なら表示
                if(readMsg.trim() != null && !readMsg.trim().equals("")){
                    Log.i(TAG,"value="+readMsg.trim());

                    valueMsg = new Message();
                    valueMsg.what = VIEW_INPUT;
                    valueMsg.obj = readMsg;

                    mHandler.sendMessage(valueMsg);

                    valueMsgToAlert = new Message();
                    valueMsgToAlert.what = VIEW_INPUT;
                    valueMsgToAlert.obj = readMsg;
                    mSmellHandler.sendMessage(valueMsgToAlert);
                }
                else{
                    // Log.i(TAG,"value=nodata");
                }

            }
        }catch(Exception e){

            valueMsg = new Message();
            valueMsg.what = VIEW_STATUS;
            valueMsg.obj = "Error1:" + e;
            mHandler.sendMessage(valueMsg);

            try{
                mSocket.close();
            }catch(Exception ee){}
            isRunning = false;
            connectFlg = false;
        }
    }

    @Override
    public void onClick(View v) {
        if(v.equals(connectButton)) {
            // 接続されていない場合のみ
            if (!connectFlg) {
                mStatusTextView.setText("try connect");

                mThread = new Thread(this);
                // Threadを起動し、Bluetooth接続
                isRunning = true;
                mThread.start();
            }
        } else if(v.equals(writeButton)) {
            // 接続中のみ書込みを行う
            if (connectFlg) {
                try {
                    mmOutputStream.write("2".getBytes());
                    mStatusTextView.setText("Write:");
                } catch (IOException e) {
                    Message valueMsg = new Message();
                    valueMsg.what = VIEW_STATUS;
                    valueMsg.obj = "Error3:" + e;
                    mHandler.sendMessage(valueMsg);
                }
            }

            else {
                mStatusTextView.setText("Please push the connect button");
            }
        }
        else if(v.equals(urlJumpButton)) {
            Intent intent = new Intent(Intent.ACTION_VIEW,Uri.parse(WebLink));
            startActivity(intent);
        }
        else if(v.equals(backButton)){
            Intent intent = new Intent(getApplication(), SubActivity.class);
            startActivity(intent);
        }
    }

    /**
     * 描画処理はHandlerでおこなう
     */
    Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            int action = msg.what;
            String msgStr = (String)msg.obj;
            if(action == VIEW_INPUT){
                mInputTextView.setText(msgStr);
            }
            else if(action == VIEW_STATUS){
                mStatusTextView.setText(msgStr);
            }
        }
    };

    Handler mSmellHandler = new Handler(){
        @Override
        public void handleMessage(Message msg){
            int action = msg.what;
            String msgStr = (String)msg.obj;
            int smellValue = Integer.parseInt(msgStr);
            if(smellValue > 850){
                mSmellStatusTextView.setText("オッケー!!");
                imageStatus.setImageResource(R.drawable.rola);

            }
            else if(smellValue < 850 && smellValue > 400){
                mSmellStatusTextView.setText("ヤバイヨヤバイヨ");
                imageStatus.setImageResource(R.drawable.degawa);
            }
        }
    };



}