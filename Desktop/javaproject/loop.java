import java.util.Scanner;
class loop
{
    public static void main(String args[])
    {
        Scanner a=new Scanner(System.in);
        int size=a.nextInt();
        int[] mark=new int[size];
        int i;
        for(i=0;i<size;i++)
        {
            mark[i]=a.nextInt();
            
        }
        System.out.println(mark[i]+mark[size-1]/2);
    }
}