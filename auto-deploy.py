#!/usr/bin/env python3
import paramiko
import os
import sys

def deploy_to_server():
    print("🚀 NextGen Logistics Auto-Deploy Starting...")
    
    # Server configuration
    hostname = "193.160.208.183"
    username = "root"
    password = "bar21!@"
    target_dir = "/var/www/wwwroot/avtogost77"
    
    try:
        # Create SSH client
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        print("🔐 Connecting to server...")
        ssh.connect(hostname, username=username, password=password)
        
        print("📋 Checking server status...")
        stdin, stdout, stderr = ssh.exec_command("ls -la /var/www/wwwroot/")
        print("Current structure:", stdout.read().decode())
        
        print("🧹 Cleaning target directory...")
        ssh.exec_command(f"mkdir -p {target_dir}")
        ssh.exec_command(f"rm -rf {target_dir}/*")
        
        print("📁 Creating backup...")
        stdin, stdout, stderr = ssh.exec_command(f"cp -r {target_dir} {target_dir}_backup_$(date +%Y%m%d_%H%M%S)")
        
        # Use SFTP to transfer files
        print("📤 Uploading files...")
        sftp = ssh.open_sftp()
        
        # Upload dist directory contents
        local_dist = "./dist/"
        for root, dirs, files in os.walk(local_dist):
            for file in files:
                local_path = os.path.join(root, file)
                relative_path = os.path.relpath(local_path, local_dist)
                remote_path = f"{target_dir}/{relative_path}"
                
                # Create remote directory if needed
                remote_dir = os.path.dirname(remote_path)
                try:
                    sftp.mkdir(remote_dir)
                except:
                    pass
                
                print(f"  Uploading: {relative_path}")
                sftp.put(local_path, remote_path)
        
        print("🔧 Setting permissions...")
        ssh.exec_command(f"chmod -R 755 {target_dir}")
        ssh.exec_command(f"chown -R www-data:www-data {target_dir}")
        
        print("🌐 Restarting web server...")
        ssh.exec_command("systemctl reload nginx")
        
        print("✅ Deployment completed successfully!")
        print(f"🎯 Site should be available at: http://{hostname}")
        
        sftp.close()
        ssh.close()
        
    except Exception as e:
        print(f"❌ Deployment failed: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    if deploy_to_server():
        print("🎉 NextGen Logistics deployed successfully!")
    else:
        print("💥 Deployment failed!")
        sys.exit(1)