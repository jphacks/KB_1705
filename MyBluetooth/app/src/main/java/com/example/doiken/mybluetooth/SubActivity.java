package com.example.doiken.mybluetooth;

/**
 * Created by doiken on 2017/10/19.
 */
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class SubActivity extends Activity {
    /* link */
    private String WebLink = "https://www.navieclipse.com/";

    /** urljump */
    private Button urlJumpButton;

    /** back */
    private Button smellButton;

    /** webRTC */
    private Button webRTCButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sub);

        urlJumpButton = (Button)findViewById(R.id.urlJumpButton);
        smellButton = (Button)findViewById(R.id.smellButton);
        webRTCButton = (Button)findViewById(R.id.webRTCButton);

        smellButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplication(), MainActivity.class);
                startActivity(intent);
            }
        });

        urlJumpButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(WebLink));
                startActivity(intent);
            }
        }
        );
        webRTCButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplication(), MainWebRTCActivity.class);
                startActivity(intent);
            }
        }
        );


    }
}